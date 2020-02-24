import spacy
import os

cwd = os.getcwd()
path = cwd + "/py/uploads/upload.txt"

with open(path,'r') as f:
    text = f.read()


nlp = spacy.load("en_core_web_sm")


doc = nlp(text)

print([t.text for t in doc])
