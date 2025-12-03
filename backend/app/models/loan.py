# File: /home/krishnaprasad/BFSIApp/backend/app/models/loan.py
from .. import db
from datetime import datetime

class Loan(db.Model):
    __tablename__ = "loan"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    loan_type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    duration_months = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='pending')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "loan_type": self.loan_type,
            "amount": float(self.amount),
            "duration_months": self.duration_months,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }

    def __repr__(self):
        return f"<Loan id={self.id} user_id={self.user_id} amount={self.amount}>"
