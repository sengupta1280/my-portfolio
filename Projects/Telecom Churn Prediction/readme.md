# 📱 Telecom Customer Churn Prediction

## 📌 Overview
This project applies **machine learning** to predict customer churn for a telecom provider.  
The workflow includes data preprocessing, handling class imbalance, feature encoding, model training (Random Forest, XGBoost), and evaluation with precision/recall/F1 metrics.

---

## 🛠️ Tools & Libraries
- **Python** – pandas, numpy, matplotlib, seaborn  
- **Machine Learning** – scikit-learn, XGBoost, imbalanced-learn  
- **Techniques** – RandomOverSampler, Ordinal Encoding, Label Encoding  

---

## 🔍 Dataset
- **Source:** `TelecomCustomerChurn.csv`  
- **Target Variable:** `Churn` (Yes / No)  
- **Features:** Customer demographics, account length, contract type, payment method, internet service, and monthly charges.  
- **Imbalance Handling:** Used `RandomOverSampler` to balance churn vs non-churn customers.  

---

## 🧠 Modeling
Trained and compared two classifiers:

| Model | Accuracy | Notes |
|--------|-----------|-------|
| **Random Forest** | ~0.78 | Good generalization; interpretable feature importance. |
| **XGBoost** | ~0.82 | Highest precision/recall on minority class after oversampling. |

Both models were evaluated using:
- `classification_report` (Precision, Recall, F1-score)
- Test–train split with `random_state=2529`

---

## 🔎 Key Insights
- Customers with **month-to-month contracts** and **electronic check payments** are more likely to churn.  
- **Longer-tenure** and **auto-pay customers** show strong retention.  
- Addressing class imbalance significantly improves recall for the churned class.

---

## 📂 Project Structure
```text
telecom-churn/
├─ README.md
├─ data/
│  └─ TelecomCustomerChurn.csv
├─ notebooks/
│  └─ telecom_churn.ipynb
└─ visuals/
   ├─ churn_distribution.png
   ├─ correlation_heatmap.png
   ├─ feature_importance.png
   └─ model_comparison.png
