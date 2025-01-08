from . import asyncapidoc 
import json
import os
import sys
from flask import jsonify, request
sys.path.append('..')
from Tools.UserInputParser import UserInputParser
from Database.DatabaseEmulator import DatabaseSim
import traceback


@asyncapidoc.route('/singleinput/<docID>', methods=['PUT'])
def createDocumentFromSingleInput(docID):
    try:
        usrInput = request.get_json() # Get user input as dictionary
        usrInputPrs = UserInputParser(usrInput) # Extract all the objects
        newAsyncApiDoc = usrInputPrs.convert2Asyncapi() # Convert to Asyncapi object
        if len(newAsyncApiDoc) == 0:
            return jsonify({
                "msg":"fail",
                "description":"Some internet error. Failed to generate the asyncapi document. Check the input and try again."
                })
        dbe = DatabaseSim()
        dbe.StoreData(docID, newAsyncApiDoc)
        return jsonify({"msg":"success", "data":newAsyncApiDoc})
    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'msg': 'fail'})