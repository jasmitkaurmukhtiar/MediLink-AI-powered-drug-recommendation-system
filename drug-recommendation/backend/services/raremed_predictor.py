import sys
import builtins
import __main__

# Fix Python2 module name
sys.modules['__builtin__'] = builtins


# Recreate the vocabulary class expected by the pickle
class Voc(object):
    def __init__(self):
        self.idx2word = {}
        self.word2idx = {}


# Register class so pickle can find it
__main__.Voc = Voc
import torch
import dill as pickle
import numpy as np
from models.RAREMed import RAREMed



MODEL_PATH = "models/Epoch_10_JA_0.4146_DDI_0.02701.model"


def load_model():

    voc = pickle.load(open("data/voc_final.pkl", "rb"))
    diag_voc = voc["diag_voc"] 
    pro_voc = voc["pro_voc"] 
    med_voc = voc["med_voc"]

    print("==== VOCAB CHECK ====")
    print(type(diag_voc.idx2word))
    print(len(diag_voc.idx2word))
    print(list(diag_voc.idx2word.keys())[:5])
    print("=====================")
    

    voc_size = [
        len(diag_voc.idx2word) + 1 ,
        len(pro_voc.idx2word) + 1 ,
        len(med_voc.idx2word)
    ]

    
    ddi_adj = pickle.load(open("data/ddi_A_final.pkl", "rb"))

    class Args:
        embed_dim = 384
        adapter_dim = 512
        cuda = 0
        patient_seperate = False
        dropout = 0.1
        encoder_layers = 3
        nhead = 2
        num_classes = 84   # instead of 100

    args = Args()

    model = RAREMed(args, voc_size, ddi_adj)

    state_dict = torch.load(MODEL_PATH, map_location="cpu")

    model.load_state_dict(state_dict, strict=False)
    
    model.eval()

    return model


def run_prediction(model, diag_ids, proc_ids, med_ids):

    patient = [[diag_ids, proc_ids, med_ids]]

    with torch.no_grad():
        output, aux = model(patient)

    probs = torch.sigmoid(output).cpu().numpy().flatten()

    top_k = np.argsort(probs)[-5:][::-1]

    return top_k.tolist()

def generate_lifestyle(diag_ids, proc_ids, med_ids, diag_voc, pro_voc, med_voc):
    
    diagnoses = [diag_voc.idx2word[i] for i in diag_ids if i in diag_voc.idx2word]
    procedures = [pro_voc.idx2word[i] for i in proc_ids if i in pro_voc.idx2word]
    meds = [med_voc.idx2word[i] for i in med_ids if i in med_voc.idx2word]

    text_diag = " ".join(diagnoses).lower()
    text_proc = " ".join(procedures).lower()
    text_med = " ".join(meds).lower()

    advice = set()

    # 🔹 Diagnosis-based
    if "hypertension" in text_diag or "essential hypertension" in text_diag:
        advice.update([
            "Reduce salt intake",
            "Exercise regularly"
        ])

    if "diabetes" in text_diag:
        advice.update([
            "Control sugar intake",
            "Follow a balanced diet"
        ])

    if "obesity" in text_diag:
        advice.add("Focus on weight loss and physical activity")

    # 🔹 Medication-based inference
    if any(x in text_med for x in ["insulin", "metformin"]):
        advice.add("Follow a low-sugar diet")

    if any(x in text_med for x in ["atorvastatin", "statin"]):
        advice.add("Reduce fatty food intake")

    # 🔹 Procedure-based
    if "angioplasty" in text_proc:
        advice.update([
            "Avoid smoking",
            "Follow heart-healthy diet"
        ])

    return list(advice)[:5]  # limit output