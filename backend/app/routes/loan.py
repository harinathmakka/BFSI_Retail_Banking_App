# File: /home/krishnaprasad/BFSIApp/backend/app/routes/loan.py
from flask import Blueprint, request, jsonify
from .. import db
from ..models.loan import Loan
from ..models.transaction import Transaction
from ..models.user import User
import jwt
from datetime import datetime

loan_bp = Blueprint('loan', __name__)

# Local token helpers (consistent with account routes)
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

@loan_bp.route('/apply', methods=['POST'])
def apply_loan():
    user_id, err_resp, code = _get_current_user_id()
    if err_resp:
        return err_resp, code

    data = request.get_json() or {}
    loan_type = data.get('loan_type')
    amount = data.get('amount')
    duration = data.get('duration')

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid loan amount'}), 400

    try:
        duration = int(duration)
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid duration'}), 400

    if not loan_type or amount <= 0 or duration <= 0:
        return jsonify({'error': 'Missing or invalid loan details'}), 400

    # create loan record
    new_loan = Loan(
        user_id=user_id,
        loan_type=loan_type,
        amount=amount,
        duration_months=duration,
        status='pending',
        timestamp=datetime.utcnow()
    )
    db.session.add(new_loan)

    # also log a transaction for the loan application (so it appears in transaction logs)
    user = User.query.get(user_id)
    txn = Transaction(
        user_id=user_id,
        amount=amount,
        type='loan-application',
        timestamp=datetime.utcnow(),
        payer_email=user.email if user else None,
        payee_email=None,
        description=f'Loan application for {loan_type}'
    )
    db.session.add(txn)

    db.session.commit()

    return jsonify({'message': 'Loan application submitted', 'loan_id': new_loan.id}), 200

@loan_bp.route('/myloans', methods=['GET'])
def my_loans():
    user_id, err_resp, code = _get_current_user_id()
    if err_resp:
        return err_resp, code

    loans = Loan.query.filter_by(user_id=user_id).order_by(Loan.timestamp.desc()).all()
    result = [{
        'loan_type': l.loan_type,
        'amount': float(l.amount),
        'duration': l.duration_months,
        'status': l.status,
        'timestamp': l.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    } for l in loans]

    return jsonify({'loans': result}), 200
