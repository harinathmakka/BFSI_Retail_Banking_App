# File: backend/app/routes/account.py
from flask import Blueprint, request, jsonify
from ..models.user import User
from ..models.account import Account
from ..models.transaction import Transaction
from .. import db
import jwt
from datetime import datetime

account_bp = Blueprint('account', __name__)  # registered in create_app with prefix /api/account

# Helper: get token from header (accepts "Bearer <token>" or raw token)
def _get_token_from_header():
    auth = request.headers.get('Authorization') or request.headers.get('authorization')
    if not auth:
        return None
    if auth.startswith('Bearer '):
        return auth.split(' ', 1)[1].strip()
    return auth.strip()

# Helper: decode token and return user object or (None, error_response, status_code)
def _get_current_user():
    token = _get_token_from_header()
    if not token:
        return None, jsonify({"error": "Missing token"}), 401
    try:
        payload = jwt.decode(token, 'supersecretkey', algorithms=['HS256'])
        user_id = payload.get('user_id')
        if not user_id:
            return None, jsonify({"error": "Invalid token payload"}), 401
        user = User.query.get(user_id)
        if not user:
            return None, jsonify({"error": "User not found"}), 404
        return user, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({"error": "Token expired"}), 401
    except Exception as e:
        return None, jsonify({"error": "Invalid token", "details": str(e)}), 401

# --- Helper to ensure account exists and return it ---
def _get_or_create_account(user):
    account = Account.query.filter_by(user_id=user.id).first()
    if not account:
        account = Account(user_id=user.id, balance=0.0)
        db.session.add(account)
        db.session.commit()
    return account

# Deposit / Withdraw endpoint
@account_bp.route('/transaction', methods=['POST'])
def transaction():
    user, err_resp, code = _get_current_user()
    if err_resp:
        return err_resp, code

    data = request.get_json() or {}
    amount = data.get('amount')
    type_ = data.get('type')

    if amount is None or type_ not in ('deposit', 'withdraw'):
        return jsonify({"error": "Invalid request"}), 400

    try:
        amount = float(amount)
    except:
        return jsonify({"error": "Invalid amount"}), 400

    account = _get_or_create_account(user)

    if type_ == 'deposit':
        account.balance = (account.balance or 0.0) + amount
        db.session.add(account)
        txn = Transaction(
            user_id=user.id,
            amount=amount,
            type='deposit',
            payer_email=None,
            payee_email=user.email,
            description='Deposit to account'
        )
        db.session.add(txn)
        db.session.commit()
        return jsonify({"message": "Deposit successful", "balance": account.balance}), 200

    # withdraw
    if type_ == 'withdraw':
        if amount <= 0:
            return jsonify({"error": "Invalid amount"}), 400
        if (account.balance or 0.0) < amount:
            return jsonify({"error": "Insufficient balance"}), 400
        account.balance = (account.balance or 0.0) - amount
        db.session.add(account)
        txn = Transaction(
            user_id=user.id,
            amount=amount,
            type='withdraw',
            payer_email=user.email,
            payee_email=None,
            description='Withdrawal from account'
        )
        db.session.add(txn)
        db.session.commit()
        return jsonify({"message": "Withdraw successful", "balance": account.balance}), 200

# Fund transfer endpoint
@account_bp.route('/transfer', methods=['POST'])
def transfer():
    user, err_resp, code = _get_current_user()
    if err_resp:
        return err_resp, code

    data = request.get_json() or {}
    recipient_email = data.get('recipient_email')
    amount = data.get('amount')

    if not recipient_email or amount is None:
        return jsonify({"error": "Invalid request"}), 400

    try:
        amount = float(amount)
    except:
        return jsonify({"error": "Invalid amount"}), 400

    if amount <= 0:
        return jsonify({"error": "Transfer amount must be positive"}), 400

    # sender account
    sender_account = Account.query.filter_by(user_id=user.id).first()
    if not sender_account or (sender_account.balance or 0.0) < amount:
        return jsonify({"error": "Insufficient balance"}), 400

    # recipient user & account
    recipient_user = User.query.filter_by(email=recipient_email).first()
    if not recipient_user:
        return jsonify({"error": "Recipient not found"}), 404

    recipient_account = Account.query.filter_by(user_id=recipient_user.id).first()
    if not recipient_account:
        recipient_account = Account(user_id=recipient_user.id, balance=0.0)
        db.session.add(recipient_account)
        db.session.commit()

    # Perform transfer (update balances)
    sender_account.balance = (sender_account.balance or 0.0) - amount
    recipient_account.balance = (recipient_account.balance or 0.0) + amount

    # Create transaction records:
    debit_txn = Transaction(
        user_id=user.id,
        amount=amount,
        type='transfer_debit',
        payer_email=user.email,
        payee_email=recipient_user.email,
        description=f'Transfer to {recipient_user.email}'
    )
    credit_txn = Transaction(
        user_id=recipient_user.id,
        amount=amount,
        type='transfer_credit',
        payer_email=user.email,
        payee_email=recipient_user.email,
        description=f'Transfer from {user.email}'
    )

    db.session.add(sender_account)
    db.session.add(recipient_account)
    db.session.add(debit_txn)
    db.session.add(credit_txn)
    db.session.commit()

    # return updated sender balance so frontend can update immediately
    return jsonify({"message": f"Transferred ₹{amount} to {recipient_email}", "balance": sender_account.balance}), 200

# Get transactions for current user (payer, payee, or actor)
@account_bp.route('/transactions', methods=['GET'])
def get_transactions():
    user, err_resp, code = _get_current_user()
    if err_resp:
        return err_resp, code

    # Ensure account exists and get current balance
    account = Account.query.filter_by(user_id=user.id).first()
    current_balance = account.balance if account else 0.0

    # fetch transactions where user is either actor (user_id) OR payer/payee matches
    txns = Transaction.query.filter(
        (Transaction.user_id == user.id) |
        (Transaction.payer_email == user.email) |
        (Transaction.payee_email == user.email)
    ).order_by(Transaction.timestamp.desc()).all()

    return jsonify({
        "transactions": [t.to_dict() for t in txns],
        "balance": current_balance
    }), 200

# Optional: get only balance endpoint
@account_bp.route('/balance', methods=['GET'])
def get_balance():
    user, err_resp, code = _get_current_user()
    if err_resp:
        return err_resp, code

    account = Account.query.filter_by(user_id=user.id).first()
    return jsonify({"balance": account.balance if account else 0.0}), 200
