# ❤️ Prediction of Cardiovascular Diseases using Predictive Analytics

## 📌 Overview
Cardiovascular disease (CVD) remains one of the leading causes of death worldwide. This project explores the use of **AI and machine learning** to identify early risk factors for CVD, leveraging real-world datasets and cloud-based ML tools.  

The goal is to demonstrate how **predictive analytics** can support healthcare professionals in risk stratification and patient monitoring.  

---

## 🛠️ Tools & Technologies
- **Python (Google Colab / Jupyter Notebooks)** – model development and testing  
- **Scikit-learn** – decision trees, classification models, evaluation metrics  
- **Azure AutoML** – automated model training and deployment  
- **Data Visualization** – heatmaps, correlation plots, feature importance  

---

## 🔍 Key Insights
- Key predictors of cardiovascular disease include **age, cholesterol levels, blood pressure, and BMI**.  
- AutoML selected a **Voting Ensemble model** achieving accuracy >90% on test data.  
- Decision Tree models provided interpretability, useful for clinicians.  
- Visualizations revealed strong feature correlations, validating medical research on CVD risk factors.  

---

## 📊 Analysis Components
1. **Exploratory Data Analysis** – descriptive statistics, correlation heatmaps.  
2. **Decision Tree Modeling** – interpretable model for patient-level predictions.  
3. **AutoML Experiments** – best-performing ensemble model deployed in Azure ML.  
4. **Healthcare Framing** – mapping analytics to real-world preventive healthcare strategies.  

---

## 📂 Repository Structure
```text
Prediction of Cardiovascular Diseases using Predictive Analytics/
├─ README.md
├─ data/
│  └─ heart_disease_test_all.csv                # Dataset used for ML
├─ notebooks/
│  ├─ heartwise_ai.ipynb               # AI notebook with modeling
└─ visuals/
   ├─ correlation_heatmap.png
   ├─ decision_tree.png
   └─ feature_importance.png
