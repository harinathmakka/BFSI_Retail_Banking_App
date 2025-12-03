# File: /home/krishnaprasad/BFSIApp/backend/app/models/transaction.py
from .. import db
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = "transaction"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)  # user who triggered the transaction (actor)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(40), nullable=False)  # deposit, withdraw, transfer_debit, transfer_credit, etc.
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    payer_email = db.Column(db.String(120))   # payer email (for transfers and debits)
    payee_email = db.Column(db.String(120))   # payee email (for transfers and credits)
    description = db.Column(db.String(255))   # optional description

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "amount": float(self.amount) if self.amount is not None else None,
            "type": self.type,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "payer_email": self.payer_email,
            "payee_email": self.payee_email,
            "description": self.description,
        }

    def __repr__(self):
        return f"<Transaction id={self.id} type={self.type} amount={self.amount}>"
