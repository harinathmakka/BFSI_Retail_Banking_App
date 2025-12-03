# File: /home/krishnaprasad/BFSIApp/backend/app/routes/support.py
from flask import Blueprint, request, jsonify
from .. import db
from ..models.support import SupportTicket
from ..models.user import User
import jwt
from datetime import datetime

support_bp = Blueprint('support', __name__)

# Reuse the same header/token helpers pattern used across other routes:
def _get_token_from_header():
    auth = request.headers.get('Authorization') or request.headers.get('authorization')
    if not auth:
        return None
    # if header is "Bearer <token>" return just the token part
    if auth.startswith('Bearer '):
        return auth.split(' ', 1)[1].strip()
    return auth.strip()

def _get_current_user():
    token = _get_token_from_header()
    if not token:
        return None, jsonify({'error': 'Missing token'}), 401
    try:
        payload = jwt.decode(token, 'supersecretkey', algorithms=['HS256'])
        user_id = payload.get('user_id')
        if not user_id:
            return None, jsonify({'error': 'Invalid token payload'}), 401
        user = User.query.get(user_id)
        if not user:
            return None, jsonify({'error': 'User not found'}), 404
        return user, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({'error': 'Token expired'}), 401
    except Exception as e:
        return None, jsonify({'error': 'Invalid token', 'details': str(e)}), 401

@support_bp.route('/submit', methods=['POST'])
def submit_ticket():
    user, err_resp, code = _get_current_user()
    if err_resp:
        return err_resp, code

    data = request.get_json() or {}
    message = data.get('message', '').strip()

    if not message:
        return jsonify({'error': 'Message required'}), 400

    ticket = SupportTicket(user_id=user.id, message=message, created_at=datetime.utcnow())
    db.session.add(ticket)
    db.session.commit()

    return jsonify({'message': 'Support message submitted', 'ticket': ticket.to_dict()}), 200

@support_bp.route('/mytickets', methods=['GET'])
def get_tickets():
    user, err_resp, code = _get_current_user()
    if err_resp:
        return err_resp, code

    tickets = SupportTicket.query.filter_by(user_id=user.id).order_by(SupportTicket.created_at.desc()).all()
    result = [t.to_dict() for t in tickets]

    return jsonify({'tickets': result}), 200
