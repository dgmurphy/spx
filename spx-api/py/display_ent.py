import spacy
import os
from spacy import displacy
from spacy.pipeline import EntityRuler
import json
from spacy.matcher import Matcher
from spacy.tokens import Span


def add_mgrs_ent(matcher, doc, i, matches):

    # Get the current match and create tuple of entity label, start and end.
    # Append entity to the doc's entity. (Don't overwrite doc.ents!)
    match_id, start, end = matches[i]
    entity = Span(doc, start, end, label="MGRS")
    doc.ents += (entity,)
    #print(entity.text)    

# text = "When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously."

# nlp = spacy.load("en_core_web_sm")
# doc = nlp(text)
# displacy.serve(doc, style="ent")



nlp = spacy.load("en_core_web_sm")

matcher = Matcher(nlp.vocab)

mgrs_reg = {"TEXT": {"REGEX": ".*//"}}
#mgrs_pattern = "//MGRSCOORD: 38TQL070498//"
#mgrs_pattern = [{"//MGRSCOORD"}, {":"}, mgrs_reg]
mgrs_pattern = [{"TEXT": "//MGRSCOORD"}, {"TEXT": ":"}, mgrs_reg]

matcher.add("MGRS", add_mgrs_ent, mgrs_pattern)


ruler = EntityRuler(nlp)
# patterns = [{"label": "MGRS", "pattern": mgrs_pattern},
#             {"label": "NORP", "pattern": "BFB", "id": "bilasuvar_freedom_brigade"}
#             ]
patterns = [
            {"label": "NORP", "pattern": "BFB", "id": "bilasuvar_freedom_brigade"}
            ]

ruler.add_patterns(patterns)
nlp.add_pipe(ruler)

cwd = os.getcwd()
path = cwd + "/py/uploads/display-upload-ent.txt"

#print(path)

with open(path,'r') as f:
    text = f.read()


doc = nlp(text)

matches = matcher(doc)

for match_id, start, end in matches:
    string_id = nlp.vocab.strings[match_id]  # Get string representation
    span = doc[start:end]  # The matched span
    #print("Match: ", match_id, string_id, start, end, span.text)

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


# print("\n\n")
# print([(ent.text, ent.label_, ent.ent_id_) for ent in doc.ents])
# print("\n\n")
# print([token.text for token in doc])