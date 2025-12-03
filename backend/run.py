# File: /home/krishnaprasad/BFSIApp/backend/run.py
from app import create_app, db

app = create_app()

with app.app_context():
    # Create tables if not present (safe when using migrations too)
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
