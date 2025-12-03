# File: /home/krishnaprasad/BFSIApp/backend/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Configuration - keep your values; consider using env vars in future
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'supersecretkey')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'mysql+pymysql://root:prasad123@localhost/bfsi_db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Import models so migrations detect them
    # (important to import here before running migrations)
    from .models.user import User
    from .models.account import Account
    from .models.transaction import Transaction

    # Register blueprints (register once with url_prefix here)
    from .routes.auth import auth_bp
    from .routes.account import account_bp
    from .routes.loan import loan_bp
    from .routes.bill import bill_bp
    from .routes.support import support_bp
    from .routes.transaction import txn_bp

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(account_bp, url_prefix='/api/account')
    app.register_blueprint(loan_bp, url_prefix='/api/loan')
    app.register_blueprint(bill_bp, url_prefix='/api/bill')
    app.register_blueprint(txn_bp, url_prefix='/api/txn')
    app.register_blueprint(support_bp, url_prefix='/api/support')

    return app
