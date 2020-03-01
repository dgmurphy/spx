import spacy
import json
import os

text = """On 21 February, BFB commanders met at an unknown location in the vicinity of Oghuz, 
 //MGRSCOORD: 38TQL070498//, in Vetlia Province, Atropia. The purpose of the meeting was   
 to plan attack operations aimed at unspecified Atropian targets. The commanders discussed  
 weapon acquisition details and planned attacks on Atropian targets. The attacks will  
 target Government facilities and non-Bilasuvar civilian gatherings using improvised  
 explosive devices (IED), NFI."""

text = "Autonomous cars shift insurance liability toward manufacturers"


cwd = os.getcwd()
path = cwd + "/py/uploads/noun-chunks-upload.txt"
with open(path,'r') as f:
    text = f.read()

nlp = spacy.load("en_core_web_sm")
doc = nlp(text)
chunks_dict = {}
chunks = []
idx = 0
for chunk in doc.noun_chunks:
    idx += 1
    chunk_dict = {
        'chunk-text': chunk.text,
        'chunk-root-text': chunk.root.text,
        'chunk-root-dep': chunk.root.dep_,
        'chunk-root-head-text': chunk.root.head.text
    }
    #print(chunk.text, chunk.root.text, chunk.root.dep_,
    #        chunk.root.head.text)
    #print(str(chunk_dict))
    chunks.append(chunk_dict)

chunks_dict['chunks'] = chunks
chunks_json = json.dumps(chunks_dict)
print(chunks_json)
