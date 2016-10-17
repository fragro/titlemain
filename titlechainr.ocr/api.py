from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
import sys
import re
from pipeline import *
from helpers import *

def parseText(txt):
	print('parsing text...')
	ret = getCandidate(txt)
	if not 'candidate' in ret:
		return {}
	cand = ret['candidate']
	#get the lot
	ret = processLots(cand, ret)
	print(ret)
	# get the block
	ret = processBlock(cand, ret)
	print(ret)
	ret = processAddition(cand, ret)
	print(ret)
	#if addition 
	if "sub" in ret:
		ret = processLocation(cand, ret)
		ret = fixAddition(cand, ret)
	print(ret)
	return ret

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
		output = parseText(text)
		return output, status.HTTP_200_OK
	except Exception as inst:
		print(type(inst))    # the exception instance
		print(inst.args)     # arguments stored in .args
		print(inst) 
		return "Error", status.HTTP_500_INTERNAL_SERVER_ERROR

if __name__ == "__main__":
	app.run(debug=True)