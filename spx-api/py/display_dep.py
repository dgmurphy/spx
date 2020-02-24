import spacy
from spacy import displacy

nlp = spacy.load("en_core_web_sm")

doc = nlp("This is a test sentence.")
obj = displacy.parse_deps(doc)
#print (displacy.parse_deps(doc))
#print("Hello world.")
print(obj)