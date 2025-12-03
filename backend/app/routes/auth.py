# File: /home/krishnaprasad/BFSIApp/backend/app/routes/auth.py
from flask import Blueprint, request, jsonify
from ..models.user import User
from .. import db
import jwt, datetime, random
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password_raw = data.get('password')
    if not (email and password_raw):
        return jsonify({'error': 'Email and password required'}), 400

    password = generate_password_hash(password_raw)
    otp = str(random.randint(100000, 999999))

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'error': 'User already exists'}), 400

    new_user = User(name=name, email=email, password=password, otp=otp)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully', 'otp': otp, 'email': email}), 201

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json() or {}
    email = data.get('email')
    otp = data.get('otp')

    user = User.query.filter_by(email=email, otp=otp).first()
    if user:
        user.otp = None  # Clear OTP
        db.session.commit()
        return jsonify({'message': 'OTP verified successfully'}), 200
    return jsonify({'error': 'Invalid OTP'}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, 'supersecretkey', algorithm='HS256')

    return jsonify({'message': 'Login successful', 'token': token}), 200
