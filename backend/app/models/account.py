# File: /home/krishnaprasad/BFSIApp/backend/app/models/account.py
from .. import db

class Account(db.Model):
    __tablename__ = "account"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)
    balance = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "balance": float(self.balance) if self.balance is not None else 0.0
        }

    def __repr__(self):
        return f"<Account user_id={self.user_id} balance={self.balance}>"
