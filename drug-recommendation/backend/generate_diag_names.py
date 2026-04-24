import json

with open("data/diag_mapping.json") as f:
    codes = json.load(f)

with open("data/icd_prefix_mapping.json") as f:
    prefix_map = json.load(f)

new_map = {}

for code in codes.keys():
    name = "Unknown Diagnosis"

    for prefix in prefix_map:
        if code.startswith(prefix):
            name = prefix_map[prefix]
            break

    new_map[code] = f"{name} ({code})"

with open("data/diag_mapping_final.json", "w") as f:
    json.dump(new_map, f, indent=2)

print("Generated readable diagnosis names")