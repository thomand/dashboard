#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re
from urllib.request import Request, urlopen
from firebase import firebase

#get all top fifteen stories urls from gemini.no
def getTopFifteen():
	req = Request('http://www.gemini.no', headers={'User-Agent': 'Mozilla/5.0'})
	gemini = urlopen(req).read().decode('utf-8')
	webpage = str(gemini)
	liste= []
	top = [(a.end()) for a in list(re.finditer('<h2 class="entry-title">', webpage))]
	for i in range(0,len(top)-1):
		text = webpage[top[i]+1:top[i+1]]
		result = text[text.index("href=")+6:text.index(" rel")-1]
		liste.append(result)
	
	img = [(a.end()) for a in list(re.finditer('"article-thumbnail">', webpage))]
	for i in range(0,len(top)-1):
		text = webpage[img[i]+1:img[i+1]]
		result = text[text.index('<img src=')+10:text.index(" alt")-1]
		imageList.append(result)
	return liste

#open each page and extract part of html that contains title and tags
def openPage(url):
	req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
	gemini = urlopen(req).read().decode('utf-8')
	webpage = str(gemini)
	return webpage

#get the tags for each page as a list of strings
def getTags(html):
	start = '<i class="fa fa-tag"></i>'
	end = '<div class="footer-related hidemobile">'
	result = html[html.index(start)+26:html.index(end)-15]
	liste=[]
	start = [(a.end()) for a in list(re.finditer('"tag">', result))]
	end = [(a.start()) for a in list(re.finditer('</a>', result))]
	for i in range(0,len(start)):
		liste.append(result[start[i]:end[i]])
	return ", ".join(liste)

translate = {0:"one", 1:"two", 2:"three", 3:"four", 4:"five", 5:"six", 6:"seven", 7:"eight", 8:"nine", 9:"ten"}
headlines = {}
tag = {}
imageList = []
images = {}

def run():
	#get top 10 stories urls
	topFifteen = getTopFifteen()
	for i in range(0,10):
		#open each page and extract wanted info (title and tags)
		result = openPage(topFifteen[i])
		#extract the title from the html string
		title = result[result.index('<h1 class="entry-title">')+24:result.index('<div class="entry-excerpt row">')-10].strip()
		#extract all the tags for that story
		collectedTag = getTags(result)
		#get the indexName translation to be used as key in firebase
		indexName = translate[i]
		#add title to headlines dictionary
		headlines[indexName] = title
		#add tag to tags dictionary
		tag[indexName] = collectedTag
		#add images to dictionary
		images[indexName] = imageList[i]
	
	#open a connection to firebase and update all tags and titles in accordance with collected data
	f = firebase.FirebaseApplication('https://dashbordntnu.firebaseio.com/gemini/', None)
	snapshot = f.patch('headlines', headlines)
	snapshot2 = f.patch('tag',tag)
	snapshot3 = f.patch('image',images)
	
run()