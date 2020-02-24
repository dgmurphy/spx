import spacy
from spacy import displacy
import json

nlp = spacy.load("en_core_web_sm")

doc = nlp("TEST is a test sentence. Here is the second one.")
parse_dict = displacy.parse_deps(doc)
#print (displacy.parse_deps(doc))
#print("Hello world.")
parsed_json = json.dumps(parse_dict)
print(parsed_json)