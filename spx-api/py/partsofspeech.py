import spacy
import json
import os


text = "Apple is looking at buying U.K. startup for $1 billion"


cwd = os.getcwd()
path = cwd + "/py/uploads/pos-upload.txt"
with open(path,'r') as f:
    text = f.read()


nlp = spacy.load("en_core_web_sm")
doc = nlp(text)


pos_dict = {}
pos_rows = []
for token in doc:

    pos = {
        'text': token.text,
        'lemma': token.lemma_,
        'pos': token.pos_,
        'tag': token.tag_,
        'dep': token.dep_,
        'is_stop': str(token.is_stop)
    }

    pos_rows.append(pos)

pos_dict['pos'] = pos_rows
pos_json = json.dumps(pos_dict)
print(pos_json)
