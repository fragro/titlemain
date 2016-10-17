import sys
import re
from helpers import *


#get candidate text from a text blob returned by OCR
def getCandidate(txt):
	ret = {}
	txt = prepText(txt)
	lots_test = 'lots|lot'
	accordingTo = 'according to the|recorded plat|plat thereof|according'
	lotsIdx = re.search(lots_test, txt)
	accToIdx = re.search(accordingTo, txt)
	if accToIdx == None or lotsIdx == None:
		print txt
		return {}
	cand = txt[lotsIdx.start():accToIdx.start()]
	cand = cand.encode('ascii','ignore')
	ret["candidate"] = cand
	return ret

#get 'lot' information
def processLots(cand, ret):
	print('parsing text...')
	lotsRegex1 = 'lots[a-z\s-]*\([l0-9]+\).'
	lotsRegex2 = '\s*and([a-z-\s]*)\([l0-9]+\)'
	lotRegex = 'lot[a-z\s-]*\([l0-9]+\)'
	simpleLotsRegex = 'lots[a-z\s-]*[l0-9]+[\s]*and[\s]*[l0-9]+'
	simpleLotRegex = 'lot[a-z\s-]*[l0-9]+'
	simpleLotsRegex1 = 'lots[a-z\s-]*[l0-9]+'
	simpleLotsRegex2 = '[\s]*and[\s]*[l0-9]+'

	#get the lot
	lot = re.search(lotRegex, cand)
	#check for additional lots
	additionalLots = re.search(lotsRegex1 + lotsRegex2, cand)
	#additionalLots = re.search('lots[a-zA-Z\s-]*\([0-9]+\).\s*and.*(\)?)', cand)
	if additionalLots:
		print('lot is plural')
		#get additional lots
		totalLotString = recursiveRegexSearch(lotsRegex1, lotsRegex2, cand, None)
		print(totalLotString)
		allLots = stripNumerals('and', totalLotString)
		ret["lot"] = allLots
	elif lot:
		#if lot captured
		print('lot found')
		lot = lot.group(0);
		lotNum = lot[lot.find("(")+1:lot.find(")")]
		ret["lot"] = quickFix(lotNum)
	else:
		simpleLot = re.search(simpleLotsRegex, cand)
		if simpleLot:
			print simpleLot.group(0)
			totalLotString = recursiveRegexSearch(simpleLotsRegex1, simpleLotsRegex2, cand, None)
			print(totalLotString)
			allLots = stripNumerals('and', totalLotString)
			ret["lot"] = allLots
			#check for baseCase lots as well
	return ret;

#process 'block' information
def processBlock(cand, ret):
	blockRegex = 'block[a-zA-Z\s-]*\([l0-9]+\)|block[\s]*[0-9]+'
	block = re.search(blockRegex, cand)
	if block:
		print('block found')
		block = block.group(0);
		print block
		if not "(" in block:
			blockNum = block.replace('block', '')
		else:
			blockNum = block[block.find("(")+1:block.find(")")]
		ret["block"] = quickFix(blockNum)
	return ret


#process an 'addition' or 'subdivision'
def processAddition(cand, ret):
	for test in ["subdivision", "addition"]:
		additionRegexSpecific = "of([a-z\s\'\-]*)" + test + "|inclusive([a-z\s\'\-\,]*)" + test
		additionRegex = "([a-z\s\'\-]*)\,\san\s" + test + "|,([a-z\s\'\-]*)" + test
		additionRegex2 = "([a-z\'\-]*)\s" + test

		addition = re.search(additionRegex, cand)
		additionSecondary = re.search(additionRegex2, cand)
		additionSpec = re.search(additionRegexSpecific, cand)
		if additionSpec:
			print(additionSpec.group(0))
			addition = getSubdivision(additionSpec)
			#get the first value
			ret["sub"] = addition
			return ret
		elif addition:
			print(addition.group(0))
			addition = getSubdivision(addition)
			#get the first value
			ret["sub"] = addition
			return ret
		elif additionSecondary: 
			print(additionSecondary.group(0))
			#try secondary addition format
			addition = getSubdivision(additionSecondary)
			ret["sub"] = addition
			return ret
		else:
			#addition not found!
			print("No " + test)
	return ret

def processLocation(cand, ret):
	#remove extraneous characters
	etc = cand[cand.find(ret["sub"]):].replace(ret["sub"], "")
	print "Location candidate"
	print etc
	#for each value we need to spit on ",", "in", "to"
	print etc
	etcVals = etc.split(',')
	etcNext = []
	for i in etcVals:
		tester = i.split("to")
		print tester
		for j in tester:
			tester2 = j.split("in")
			for k in tester2: 
				etcNext.append(k)
	#now go through and clean the listing
	clean = []
	for dirty in etcNext:
		#add some extra padding
		if not "subdivision" in dirty and not "lot" in dirty and not "block" in dirty and not "addition" in dirty:
			dirty = " " + dirty + " "
			dirty = dirty.replace(" in ", " ")
			dirty = dirty.replace(" to ", " ")
			dirty = dirty.replace("section", " ")
			dirty = dirty.replace("the city of", " ")
			dirty = dirty.replace("state of", " ")
			dirty = dirty.strip(" ")
			if dirty:
				#first let's test for garbage i.e. subdivision, block, lot, etc
					#city, county, and state length must be sufficient
					if len(dirty) > 2:
						clean.append(dirty)
	print clean
	if len(clean) == 2:
		#if length of the list is 2 we have oldstyle format without city
		ret["county"] = clean[0]
		ret["state"] = clean[1]
	elif len(clean) == 3:
		ret["city"] = clean[0]
		ret["county"] = clean[1]
		ret["state"] = clean[2]	
	print clean
	return ret
