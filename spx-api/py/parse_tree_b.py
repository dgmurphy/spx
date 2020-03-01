import spacy
import json
import os


cwd = os.getcwd()
path = cwd + "/py/uploads/parse-tree-b-upload.txt"
with open(path,'r') as f:
    text = f.read()


nlp = spacy.load("en_core_web_sm")
doc = nlp(text)


tree_dict = {}
array = []

roots = [token for token in doc if token.head == token]

for root in roots:

    try:
        subject = list(root.lefts)[0]    # may be empty
        for descendant in subject.subtree:
            assert subject is descendant or subject.is_ancestor(descendant)

            ancestors = ""
            for ancestor in descendant.ancestors:
                ancestors += str(ancestor.text) + ", "

            ancestors = ancestors[:-2]

            row_dict = {
                'root': str(root),
                'text': descendant.text,
                'dep': descendant.dep_,
                'n_lefts': descendant.n_lefts,
                'n_rights': descendant.n_rights,
                'ancestors': ancestors
            }

            array.append(row_dict)
            # print(descendant.text, descendant.dep_, descendant.n_lefts,
            #         descendant.n_rights,
            #         [ancestor.text for ancestor in descendant.ancestors])

    except:
        pass

tree_dict['tree'] = array
tree_json = json.dumps(tree_dict)
print(tree_json)


