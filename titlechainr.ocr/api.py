from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
import sys
import re
from pipeline import pipelineInit
 
app = FlaskAPI(__name__)

@app.route("/ocr", methods=['POST'])
def ocr():
	"""
	Execute parser and return data
	"""
	print('parse text')
	text = request.data['text']
	if not text:
		return "No text", status.HTTP_500_INTERNAL_SERVER_ERROR
	try:
		output = pipelineInit(text)
		return output, status.HTTP_200_OK
	except Exception as inst:
		print(type(inst))    # the exception instance
		print(inst.args)     # arguments stored in .args
		print(inst) 
		return "Error", status.HTTP_500_INTERNAL_SERVER_ERROR

if __name__ == "__main__":
	app.run(debug=True)