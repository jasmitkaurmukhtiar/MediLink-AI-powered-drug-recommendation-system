import pickle

# load DDI matrix
with open("data/ddi_A_final.pkl", "rb") as f:
    ddi_matrix = pickle.load(f)


def filter_ddi(preds):

    safe_preds = []
    interactions = []

    for drug in preds:

        conflict = False

        for existing in safe_preds:

            if ddi_matrix[drug][existing] == 1:
                interactions.append((drug, existing))
                conflict = True
                break

        if not conflict:
            safe_preds.append(drug)

    return safe_preds, interactions