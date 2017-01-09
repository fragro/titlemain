import sys
import re
from helpers import *


#remove to-wit: and it's various forms
def identifyState(cand, ret):
	hit = re.search(stateRegex, cand)
	if hit is not None:
		txt = hit.group(0)
		txt = txt.replace('state', '')
		txt = txt.replace('of', '')
		txt = txt.strip(' ')
		ret['state'] = txt
		print 'state found'
	return ret


#remove to-wit: and it's various forms
def identifyCounty(cand, ret):
	hit = re.search(countyRegex, cand)
	if hit is not None:
		txt = hit.group(0)
		txt = txt.replace('county', '')
		txt = txt.replace('of', '')
		txt = txt.strip(' ')
		ret['county'] = txt
		print 'county found'
	return ret

#processes ordinal information for 
def processOrdinal(cand, ret):
	ordinalhit = re.search(ordinalRegex, cand)
	if ordinalhit is not None:
		ordTxt = ordinalhit.group(0)
		ret['ordinal'] = parseOrdinal(ordTxt)
	return ret

#remove to-wit: and it's various forms
def preprocessWit(cand, ret):
	op = cand.split(':')
	if len(op) == 2:
		#towit and statement
		return op[1]
	else:
		#error
		pass
	return cand

#process section, township, range
def processSTR(cand, ret):
	strinfo = re.search(strRegex, cand)
	if strinfo:
		strval = strinfo.group(0)
	#remove comma, parens, and other
	strval = strval.replace(',', '')
	strval = strval.replace(')', '')
	strval = strval.replace('(', '')
	strval = strval.replace('~', '')
	strval = strval.replace('-', '')
	strval = ''.join([i if ord(i) < 128 else ' ' for i in strval])
	ret['str'] = strval.strip(' ')
	return ret

#rural version of stripping numerals, doesn't need to be as exact
def removeNumerals(cand, ret):
	for i in NUMERAL_LIST:
		cand = cand.replace(i, ' ')
	return cand

def finalizeRuralLocation(cand, ret):
	aux = ret['str'].split(' ')
	aux[:] = [x for x in aux if (x != '' and x != ' ')]
	if len(aux) == 8:
		ret['section'] = int(aux[1])
		ret['township'] = int(aux[3])
		ret['townshipDir'] = aux[4]
		ret['range'] = int(aux[6])
		ret['rangeDir'] = aux[7]
	else:
		print 'incorrect length on STR: ' + str(len(aux))	
		print aux
	return ret