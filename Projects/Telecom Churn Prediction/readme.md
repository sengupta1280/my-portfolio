# 📱 Telecom Customer Churn Prediction

## 📌 Overview
This project uses **supervised machine learning** to predict telecom customer churn.  
It explores customer demographics, contract details, and service types to help identify at-risk customers and reduce attrition.

---

## 🛠️ Tools & Libraries
- **Python** – pandas, numpy, matplotlib, seaborn  
- **Machine Learning** – scikit-learn, XGBoost, imbalanced-learn  
- **Techniques** – RandomOverSampler (class balance), Ordinal & Label Encoding  

---

## 🔍 Dataset
- **Source:** `TelecomCustomerChurn.csv`  
- **Target:** `Churn` (`Yes` / `No`)  
- **Rows:** ~5,174 (balanced via oversampling)  
- **Features:** Tenure, Contract type, Payment method, Internet service, Monthly charges, and more.

---

## 🧠 Modeling & Results

### Random Forest Classifier
| Metric | Precision | Recall | F1-Score | Accuracy |
|:-------|:-----------|:--------|:----------|:----------|
| **No** | 0.94 | 0.87 | 0.90 |  |
| **Yes** | 0.83 | 0.95 | 0.89 |  |
| **Macro Avg** | 0.89 | 0.88 | 0.88 |  |
| **Weighted Avg** | 0.89 | 0.88 | 0.88 | **88%** |

**Observation:** Strong performance across both classes, excellent recall for churned customers.

---

### XGBoost Classifier
| Metric | Precision | Recall | F1-Score | Accuracy |
|:-------|:-----------|:--------|:----------|:----------|
| **No** | 0.91 | 0.76 | 0.83 |  |
| **Yes** | 0.79 | 0.92 | 0.85 |  |
| **Macro Avg** | 0.85 | 0.84 | 0.84 |  |
| **Weighted Avg** | 0.85 | 0.84 | 0.84 | **84%** |

**Observation:** XGBoost achieved higher recall for churners but slightly lower overall accuracy than Random Forest.

---

## 🔎 Key Insights
- Customers on **month-to-month contracts** and **electronic check payments** churn more frequently.  
- **Tenure** strongly correlates with retention — longer customers are less likely to churn.  
- Oversampling improved minority-class detection substantially.

---

## 📂 Repository Structure
```text
telecom-churn/
├─ README.md
├─ data/
│  └─ TelecomCustomerChurn.csv
├─ notebooks/
│  └─ telecom_churn.ipynb

