import spacy
import os
from spacy import displacy
from spacy.pipeline import EntityRuler
import json

# text = "When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously."

# nlp = spacy.load("en_core_web_sm")
# doc = nlp(text)
# displacy.serve(doc, style="ent")



nlp = spacy.load("en_core_web_sm")

ruler = EntityRuler(nlp)
patterns = [{"label": "MGRS", "pattern": "//MGRSCOORD: 38TQL070498//"}]
ruler.add_patterns(patterns)
nlp.add_pipe(ruler)

cwd = os.getcwd()
path = cwd + "/py/uploads/display-upload-ent.txt"

#print(path)

with open(path,'r') as f:
    text = f.read()


doc = nlp(text)

#sentence_spans = list(doc.sents)

parse_dict = displacy.parse_ents(doc)
#parse_dict = displacy.render(doc, style="ent")
ents_arr = parse_dict['ents']

spans = []
for ent in ents_arr:
    ent['type'] = ent['label']
    del ent['label']
    spans.append(ent)


# reformat into the displacy-ent.js format (now deprecated?)
ent_dict = {}
#ent_dict['text'] = ''
#ent_dict['spans'] = [ { 'end': 20, 'start': 5, 'type': "PERSON" }, { 'end': 67, 'start': 61, 'type': "ORG" }, { 'end': 75, 'start': 71, 'type': "DATE" } ]
#ent_dict['ents'] = ['']
ent_dict['spans'] = spans

parsed_json = json.dumps(ent_dict['spans'])

print(parsed_json)

