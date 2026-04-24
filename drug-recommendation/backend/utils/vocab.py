import pickle
import json

voc = pickle.load(open("data/voc_final.pkl", "rb"))

clean_voc = {}

for k in voc:
    clean_voc[k] = {
        "word2idx": voc[k].word2idx,
        "idx2word": voc[k].idx2word
    }

with open("data/voc_final.json", "w") as f:
    json.dump(clean_voc, f)

print("Converted vocab saved as voc_final.json")