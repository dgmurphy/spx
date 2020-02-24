import spacy
import os
from spacy import displacy
import json

nlp = spacy.load("en_core_web_sm")

cwd = os.getcwd()
path = cwd + "/py/uploads/upload.txt"

#print(path)

with open(path,'r') as f:
    text = f.read()


doc = nlp(text)

parse_dict = displacy.parse_deps(doc)

parsed_json = json.dumps(parse_dict)

print(parsed_json)












