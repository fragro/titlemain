import sys
import re
from helpers import *

#getcandidate location text wrapper function
def getCandidate(txt):
	cand = getUrbanCandidate(txt)
	if cand and "candidate" in cand:
		print 'hit on urban'
		return cand, 'urban'
	else:
		cand = getRuralCandidate(txt)
		if cand and "candidate" in cand:
			print 'hit on rural'
			return cand, 'rural'
		else:
			print 'try alt rural'
			cand = alternateRuralCandidate(txt)
			if cand and "candidate" in cand:
				return cand, 'rural'
	return {}, None

#uses block, lot, addition, plat, urban based setup
def getUrbanCandidate(txt):
	ret = {}
	lotsIdx = re.search(lotRegex, txt)
	accToIdx = re.search(accordingToRegex, txt)
	if accToIdx == None or lotsIdx == None:
		#not an urban lot
		return {}
	if lotsIdx.start() > accToIdx.start():
		return {}
	ret['start'] = lotsIdx.start()
	ret['end'] = accToIdx.start()
	cand = txt[lotsIdx.start():accToIdx.start()]
	cand = cand.encode('ascii','ignore')
	print cand
	ret["candidate"] = cand
	return ret

#uses NW, Section, Township, and Range rural setup for legal property description
def getRuralCandidate(txt):
	ret = {}
	lotsIdx = re.search(toWitRegex, txt)
	print lotsIdx
	accToIdx = re.search(strRegex, txt)
	print accToIdx
	if accToIdx == None or lotsIdx == None:
		#not an rural lot
		return {}
	ret['start'] = lotsIdx.start()
	ret['end'] = accToIdx.end()
	cand = txt[lotsIdx.start():accToIdx.end()]
	cand = cand.encode('ascii','ignore')
	ret["candidate"] = cand
	return ret

def alternateRuralCandidate(txt):
	ret = {}
	#if there is no 'to wit' or similar legal language 
	#try to capture information seperately
	ordinal = re.search(ordinalRegex, txt)
	strinfo = re.search(strRegex, txt)
	if ordinal == None:
		#no ordinal?
		pass
	else:
		ret['start'] = ordinal.start()
		ret['ordinal'] = parseOrdinal(ordinal.group(0))
	if strinfo == None:
		#no string info
		pass	
	else:
		ret['end'] = strinfo.end()
		ret['candidate'] = strinfo.group(0)
	return ret