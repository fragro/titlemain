from urban import *
from rural import *
from legalClass import *
from helpers import *
from locationCandidates import getCandidate

def duplicateExists(candLocations, trial):
	for i in candLocations:
		#check the street address
		if 'str' in i and 'str' in trial: 
			if i['str'].replace(' ', '') == trial['str'].replace(' ', ''):
				return True
	return False

def pipelineInit(txt):
	ret = {}
	legalClass = checkClass(txt)
	if legalClass:
		ret['class'] = legalClass
	candLocations = pipeline(txt, [])
	#find cuonty and state
	txt = prepText(txt)
	ret = identifyState(txt, ret)
	ret = identifyCounty(txt, ret)
	for cand in candLocations:
		for strVal in ['state', 'county']:
			if not strVal in cand and strVal in ret:
				cand[strVal] = str(ret[strVal])
	ret['locations'] = candLocations
	return ret

def pipeline(txt, candLocations):
	ret, iterate, nextText = pipelineInner(txt)
	if ret:
		if not duplicateExists(candLocations, ret):
			candLocations.append(ret)
	print 'nextTextLength: ' + str(len(nextText))
	if iterate:
		#recurse
		return pipeline(nextText, candLocations)
	else:
		#base case
		return candLocations

#processes through text analysis and evaluation
def pipelineInner(txt):
	iterate = True
	nextText = ''
	print('parsing text...')
	txt = prepText(txt)
	ret, locType = getCandidate(txt)
	if not locType:
		iterate = False
		return ret, iterate, nextText
	#ret['txt'] = txt
	if not 'candidate' in ret:
		return ret, iterate, nextText
	cand = ret['candidate']
	if locType == 'urban':
		ret = urbanPipeline(cand, ret)
	elif locType == 'rural':
		ret = ruralPipeline(cand, ret)
	if 'start' in ret and 'end' in ret:
		nextText = txt.replace(txt[ret['start']:ret['end']], '')
	return ret, iterate, nextText


def urbanPipeline(cand, ret):
	#get the lot
	ret = processLots(cand, ret)
	# get the block
	ret = processBlock(cand, ret)
	ret = processAddition(cand, ret)
	#if addition 
	if "sub" in ret:
		ret = processLocation(cand, ret)
		ret = fixAddition(cand, ret)
	return ret

def ruralPipeline(cand, ret):
	cand = preprocessWit(cand, ret)
	cand = removeNumerals(cand, ret)
	ret = processSTR(cand, ret)
	ret = finalizeRuralLocation(cand, ret)
	ret = processOrdinal(cand, ret)
	print ret
	ret['candidate'] = cand
	return ret
