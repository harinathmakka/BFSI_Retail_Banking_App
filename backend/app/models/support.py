# File: /home/krishnaprasad/BFSIApp/backend/app/models/support.py
from .. import db
from datetime import datetime

class SupportTicket(db.Model):
    __tablename__ = "support_ticket"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<SupportTicket id={self.id} user_id={self.user_id}>"
