import re
from helpers import *

#check for certain classes that organize documents
def checkClass(txt):
	for legalCls in LEGAL_CLASSIFICATIONS:
		clsRegex = legalCls
		hit = re.search(clsRegex, txt)
		if hit:
			return legalCls
	return None