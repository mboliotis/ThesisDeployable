from flask import Flask
from flask import jsonify
from flask_cors import CORS

from .document import asyncapidoc

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(asyncapidoc, url_prefix='/doc')

    # return the api version
    @app.route('/')
    def apiVersion():
        return jsonify({'version':'1.0'})
    
    return app