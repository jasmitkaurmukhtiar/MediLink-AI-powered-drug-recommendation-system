from fastapi import APIRouter
import pickle
import torch
import json
import json
from pathlib import Path

from services.raremed_predictor import run_prediction, load_model
from services.ddi_checker import filter_ddi

router = APIRouter()


# -------------------------
# LOAD MODEL
# -------------------------

model = load_model()


# -------------------------
# LOAD VOCAB
# -------------------------

with open("data/voc_final.json") as f:
    voc = json.load(f)

diag_voc = voc["diag_voc"]
pro_voc = voc["pro_voc"]
med_voc = voc["med_voc"]


# -------------------------
# LOAD ATC MAPPING
# -------------------------

with open("data/atc3_mapping.json") as f:
    atc_mapping = json.load(f)

BASE_DIR = Path(__file__).resolve().parent.parent

with open(BASE_DIR / "data/diag_mapping_final.json") as f:
    diag_map = json.load(f)

BASE_DIR = Path(__file__).resolve().parent.parent

with open(BASE_DIR / "data/proc_mapping.json") as f:
    proc_map = json.load(f)


# -------------------------
# ENCODING FUNCTION
# -------------------------

def encode(codes, vocab):
    idxs = []
    for i in codes:
        if i is None:
            continue  # skip None values
        i = i.strip()
        if i in vocab["word2idx"]:
            idxs.append(vocab["word2idx"][i])
    return idxs


# -------------------------
# API
# -------------------------

@router.post("/predict")
def predict(data: dict):

    diag_ids = encode(data["diagnoses"], diag_voc)
    proc_ids = encode(data["procedures"], pro_voc)
    med_ids = encode(data["medications"], med_voc)

    print("encoded diagnoses:", diag_ids)
    print("encoded procedures:", proc_ids)
    print("encoded meds:", med_ids)

    # Run model prediction
    preds = run_prediction(model, diag_ids, proc_ids, med_ids)

    # DDI filtering
    safe_preds, interactions = filter_ddi(preds)

    def generate_lifestyle(diag_ids, proc_ids, med_ids):

    # Convert IDs → codes
        diag_codes = [diag_voc["idx2word"].get(str(i), "") for i in diag_ids]
        proc_codes = [pro_voc["idx2word"].get(str(i), "") for i in proc_ids]
        med_codes = [med_voc["idx2word"].get(str(i), "") for i in med_ids]

    # Convert to readable names
        diag_names = [diag_map.get(code, "").lower() for code in diag_codes]
        proc_names = [proc_map.get(code, "").lower() for code in proc_codes]
        med_names = [atc_mapping.get(code, "").lower() for code in med_codes]

        text_diag = " ".join(diag_names)
        text_proc = " ".join(proc_names)
        text_med = " ".join(med_names)

        advice = set()

    # 🔹 Diagnosis-based
        if "hypertension" in text_diag:
            advice.update([
                "Reduce salt intake",
                "Exercise regularly"
            ])

        if "diabetes" in text_diag:
            advice.update([
                "Control sugar intake",
                "Avoid high-carb foods"
            ])

        if "obesity" in text_diag:
            advice.add("Focus on weight loss and physical activity")

    # 🔹 Medication-based inference
        if any(x in text_med for x in ["insulin", "metformin"]):
            advice.add("Follow a low-sugar diet")

        if any(x in text_med for x in ["statin", "atorvastatin"]):
            advice.add("Reduce fatty food intake")

    # 🔹 Procedure-based
        if any(x in text_proc for x in ["angioplasty", "bypass"]):
            advice.update([
                "Avoid smoking",
                "Follow a heart-healthy diet"
            ])

    # fallback (important!)
        if len(advice) == 0:
            advice.update([
                "Maintain a balanced diet",
                "Exercise regularly",
                "Stay hydrated"
            ])

        return list(advice)[:5]
    # -------------------------
    # FORMAT DRUG OUTPUT
    # -------------------------

    drugs = []

    for i in safe_preds:

        code = med_voc["idx2word"][str(i)]

        drugs.append({
            "code": code,
            "name": atc_mapping.get(code, code)
        })
    if len(drugs) > 3:
        drugs = [d for d in drugs if d["code"] != "A06A" and d["code"] != "A12A" and d["code"] != "B05C" and d["code"] != "A02A"]

    # -------------------------
    # FORMAT INTERACTIONS
    # -------------------------

    interaction_list = []

    for d1, d2 in interactions:

        code1 = med_voc["idx2word"][str(d1)]
        code2 = med_voc["idx2word"][str(d2)]

        interaction_list.append({
            "drug1": {
                "code": code1,
                "name": atc_mapping.get(code1, code1)
            },
            "drug2": {
                "code": code2,
                "name": atc_mapping.get(code2, code2)
            }
        })

    lifestyle = generate_lifestyle(diag_ids, proc_ids, med_ids)
    return {
        "drugs": drugs,
        "interactions": interaction_list,
        "lifestyle": lifestyle}

@router.get("/codes")
def get_codes():

    diagnoses = [
        {
            "value": code,
            "label": f"{diag_map.get(code,'Unknown Diagnosis')}"
        }
        for code in diag_voc["word2idx"].keys()
    ]

    procedures = [
        {
            "value": code,
            "label": f"{code} — {proc_map.get(code,'Procedure')}"
        }
        for code in pro_voc["word2idx"].keys()
    ]

    medications = [
        {
            "value": code,
            "label": f"{code} — {atc_mapping.get(code,'Unknown Drug')}"
        }
        for code in med_voc["word2idx"].keys()
    ]

    return {
        "diagnoses": diagnoses,
        "procedures": procedures,
        "medications": medications
    }

@router.get("/dashboard-stats")
def get_dashboard_stats():
    import pickle
    from collections import Counter

    with open(BASE_DIR / "data/records_final.pkl", "rb") as f:
        records = pickle.load(f)

    with open(BASE_DIR / "data/ddi_A_final.pkl", "rb") as f:
        ddi_matrix = pickle.load(f)

    idx2diag = diag_voc["idx2word"]
    idx2med = med_voc["idx2word"]
    idx2proc = pro_voc["idx2word"]

    total_patients = len(records)
    total_visits = sum(len(p) for p in records)

    diag_counter = Counter()
    med_counter = Counter()
    proc_counter = Counter()
    visit_counter = Counter()

    score_sum = 0.0
    score_count = 0

    for patient_visits in records:
        visit_counter[len(patient_visits)] += 1
        for visit in patient_visits:
            diags = visit[0] if len(visit) > 0 else []
            procs = visit[1] if len(visit) > 1 else []
            meds = visit[2] if len(visit) > 2 else []
            
            if len(visit) > 3:
                score_sum += float(visit[3])
                score_count += 1

            for d in diags:
                code = idx2diag.get(str(d))
                if code:
                    name = str(diag_map.get(code, "Unknown"))
                    if "Unknown" not in name:
                        diag_counter[name] += 1

            for p in procs:
                code = idx2proc.get(str(p))
                if code:
                    name = str(proc_map.get(code, "Unknown Procedure"))
                    if "Unknown" not in name:
                        proc_counter[name] += 1

            for m in meds:
                code = idx2med.get(str(m))
                if code:
                    name = str(atc_mapping.get(code, "Unknown"))
                    if "Unknown" not in name:
                        med_counter[name] += 1

    ddi_count = 0
    ddi_drug_sums = {}
    for i in range(len(ddi_matrix)):
        row_sum = sum(ddi_matrix[i])
        ddi_count += row_sum
        if row_sum > 0:
            code = idx2med.get(str(i))
            name = atc_mapping.get(code, "Unknown Drug")
            if name and "Unknown" not in name:
                ddi_drug_sums[name] = ddi_drug_sums.get(name, 0) + row_sum

    top_diags = [{"disease": k, "cases": v} for k, v in diag_counter.most_common(5)]
    top_procs = [{"procedure": k, "count": v} for k, v in proc_counter.most_common(5)]
    top_meds = [{"name": k, "value": v} for k, v in med_counter.most_common(4)]
    top_ddi = [{"name": k, "interactions": v} for k, v in sorted(ddi_drug_sums.items(), key=lambda x: x[1], reverse=True)[:5]]
    
    visits_dist = sorted(visit_counter.items())
    trends = [{"name": f"{k} Visits", "patients": v} for k, v in visits_dist[:7]]

    avg_score = round(score_sum / score_count, 2) if score_count > 0 else 0.0

    return {
        "kpis": {
            "total_patients": total_patients,
            "total_visits": total_visits,
            "avg_severity_score": avg_score,
            "total_ddi_rules": int(ddi_count / 2)
        },
        "demographics": top_diags,
        "procedures": top_procs,
        "medications": top_meds,
        "trends": trends,
        "ddi_risks": top_ddi
    }

