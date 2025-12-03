# File: /home/krishnaprasad/BFSIApp/backend/app/models/bill.py
from .. import db
from datetime import datetime

class Bill(db.Model):
    __tablename__ = "bill"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    bill_type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    paid_on = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "bill_type": self.bill_type,
            "amount": float(self.amount),
            "paid_on": self.paid_on.isoformat() if self.paid_on else None
        }

    def __repr__(self):
        return f"<Bill id={self.id} user_id={self.user_id} amount={self.amount}>"
