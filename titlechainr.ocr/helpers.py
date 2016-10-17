import re

NUMERAL_LIST = [' one',
 'eight',
 'eighteen',
 'eighty',
 'eleven',
 'fifteen',
 'fifty',
 'five',
 'forty',
 'four',
 'fourteen',
 'nine',
 'nineteen',
 'ninety',
 'one',
 'one hundred',
 'seven',
 'seventeen',
 'seventy',
 'six',
 'sixteen',
 'sixty',
 'ten',
 'thirteen',
 'thirty',
 'three',
 'twelve',
 'twenty',
 'two']

def recursiveRegexSearch(regex, multi, text, match):
	#search for regex patterns of regex w/ multi X2, X3, etc. until base case
	ad = re.search(regex + multi, text)
	if ad:
		#there was a match, go further
		newregex = regex + multi
		match = ad.group(0)
		return recursiveRegexSearch(newregex, multi, text, match)
	else:
		return match

#prep Text for usage and shield against common OCR errors
def prepText(txt):
	txt = txt.lower()
	txt = txt.replace("\n", " ")
	#account for common OCR mistakes
	txt = txt.replace("{", "(")
	txt = txt.replace("}", ")")
	txt = txt.replace("?", "")
	txt = txt.replace(";", "")
	txt = txt.replace("_", "")
	txt = txt.replace(".", " ")
	return txt

def stripNumerals(divider, text):
	#a common way for legal numerals to be presented is
	#'lots seven (7) and eight (8)'
	#divide by 
	text = text.replace('lots', ' ')
	text = text.replace('lot', ' ')
	chars = text.split(divider)
	lotNums = []
	for char in chars:
		lotNum = char[char.find("(")+1:char.find(")")]
		lotRet = {"num": quickFix(lotNum)}
		#got the lotNum, lets remove it
		char = char.strip(' ').replace('(' + lotNum + ')', '')
		#now test for multiple words indicating additional information
		char = char.split(' ')
		print(char)
		char = numeralText(char)
		#char = char[0:-2]
		#drop all references to lots
		char = [x for x in char if (x != 'lot' and x != 'lots')]
		print(char)
		#if there is anything left, it is metadata
		if len(char) > 1:
			metadata = ' '.join(char)
			if(len(metadata) > 2):
				#not enough information, probably noise
				lotRet["metadata"] = metadata
		lotNums.append(lotRet)
	return lotNums

def fixAddition(cand, ret):
	#minor fixes on addition
	if "sub" in ret:
		ret["sub"] = ret["sub"].replace("-", " ")
	return ret

def quickFix(text):
	#sometimes OCR interprets a 1 and an l
	text = text.replace("l", "1")
	return text

#input a list of strings, tests each string
#to determine if it is a numeral word
def numeralText(char):
	toRemove = []
	for nums in char:
		print('testing ' + nums)
		for testNums in NUMERAL_LIST:
			if testNums in nums or nums == testNums:
				toRemove.append(nums)
	for tr in toRemove:
		try:
			char.remove(tr)
		except:
			#probably already removed as substring
			pass
	return char

#parses subdivisions
def getSubdivision(addition):
	addition = addition.group(0)
	#add some extra padding
	addition = " " + addition + " "
	addition = addition.replace(' an ', ' ')
	addition = addition.replace(' in ', ' ')
	addition = addition.replace(' of ', ' ')
	addition = addition.replace('inclusive', ' ')
	addition = addition.replace('subdivision', ' ')
	addition = addition.replace(',', ' ')
	addition = addition.replace('section', ' ')
	addition = addition.replace('addition', ' ')
	addition = addition.replace('addi', ' ')
	addition = addition.replace('additi', ' ')
	addition = addition.strip(' ')
	return addition