import spacy
import json
import os


cwd = os.getcwd()
path = cwd + "/py/uploads/parse-tree-a-upload.txt"
with open(path,'r') as f:
    text = f.read()

nlp = spacy.load("en_core_web_sm")
doc = nlp(text)

tree_dict = {}
tokens = []
for token in doc:

    children = ""
    for child in token.children:
        children += str(child) + ", "
    
    children = children[:-2]

    row_dict = {
        'text': token.text, 
        'dep': token.dep_, 
        'head-text': token.head.text, 
        'head-pos': token.head.pos_,
        'children': children
    }

    tokens.append(row_dict)

tree_dict['tree'] = tokens
tree_json = json.dumps(tree_dict)
print(tree_json)
