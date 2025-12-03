from flask import Blueprint

txn_bp = Blueprint('txn', __name__)

@txn_bp.route('/test', methods=['GET'])
def test_transaction():
    return {'message': 'Transaction route working'}
