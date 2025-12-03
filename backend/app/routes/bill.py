# File: /home/krishnaprasad/BFSIApp/backend/app/routes/bill.py
from flask import Blueprint, request, jsonify
from .. import db
from ..models.user import User
from ..models.account import Account
from ..models.transaction import Transaction
from ..models.bill import Bill
import jwt
from datetime import datetime

bill_bp = Blueprint('bill', __name__)

# Local token helpers (consistent with other routes)
def _get_token_from_header():
    auth = request.headers.get('Authorization') or request.headers.get('authorization')
    if not auth:
        return None
    if auth.startswith('Bearer '):
        return auth.split(' ', 1)[1].strip()
    return auth.strip()

def _get_current_user_id():
    token = _get_token_from_header()
    if not token:
        return None, jsonify({'error': 'Missing token'}), 401
    try:
        payload = jwt.decode(token, 'supersecretkey', algorithms=['HS256'])
        user_id = payload.get('user_id')
        if not user_id:
            return None, jsonify({'error': 'Invalid token payload'}), 401
        return user_id, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({'error': 'Token expired'}), 401
    except Exception as e:
        return None, jsonify({'error': 'Invalid token', 'details': str(e)}), 401

@bill_bp.route('/pay', methods=['POST'])
def pay_bill():
    user_id, err_resp, code = _get_current_user_id()
    if err_resp:
        return err_resp, code

    data = request.get_json() or {}
    bill_type = data.get('bill_type')
    amount_raw = data.get('amount')

    # validate
    try:
        amount = float(amount_raw)
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid amount'}), 400

    if not bill_type or amount <= 0:
        return jsonify({'error': 'Invalid input'}), 400

    # Get or create account and check balance
    account = Account.query.filter_by(user_id=user_id).first()
    if not account:
        return jsonify({'error': 'Account not found or insufficient balance'}), 400

    if (account.balance or 0.0) < amount:
        return jsonify({'error': 'Insufficient balance'}), 400

    # Deduct amount
    account.balance = (account.balance or 0.0) - amount
    db.session.add(account)

    # Create bill record
    bill = Bill(
        user_id=user_id,
        bill_type=bill_type,
        amount=amount,
        paid_on=datetime.utcnow()
    )
    db.session.add(bill)

    # Log transaction (include payer_email so it shows in logs)
    user = User.query.get(user_id)
    txn = Transaction(
        user_id=user_id,
        amount=amount,
        type='bill-payment',
        timestamp=datetime.utcnow(),
        payer_email=user.email if user else None,
        payee_email=None,
        description=f'Bill payment ({bill_type})'
    )
    db.session.add(txn)

    # Commit all at once
    db.session.commit()

    return jsonify({
        'message': 'Bill payment successful',
        'current_balance': account.balance
    }), 200

@bill_bp.route('/mybills', methods=['GET'])
def my_bills():
    user_id, err_resp, code = _get_current_user_id()
    if err_resp:
        return err_resp, code

    bills = Bill.query.filter_by(user_id=user_id).order_by(Bill.paid_on.desc()).all()

    bill_list = [{
        'bill_type': b.bill_type,
        'amount': float(b.amount),
        'paid_on': b.paid_on.strftime('%Y-%m-%d %H:%M:%S')
    } for b in bills]

    return jsonify(bill_list), 200
