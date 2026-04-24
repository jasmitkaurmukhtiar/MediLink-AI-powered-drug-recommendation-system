import json

with open("data/voc_final.json") as f:
    voc = json.load(f)

proc_codes = list(voc["pro_voc"]["word2idx"].keys())

mapping = {code: code for code in proc_codes}

with open("data/proc_mapping.json", "w") as f:
    json.dump(mapping, f, indent=2)

print("Generated procedure mapping for", len(mapping), "codes")