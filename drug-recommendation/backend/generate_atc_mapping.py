import pickle
import json

with open("data/atc3toSMILES.pkl", "rb") as f:
    atc_smiles = pickle.load(f)

codes = list(atc_smiles.keys())

mapping = {}

for code in codes:
    mapping[code] = code   # temporary placeholder

with open("data/atc3_mapping.json", "w") as f:
    json.dump(mapping, f, indent=2)

print("Generated mapping for", len(mapping), "ATC codes")