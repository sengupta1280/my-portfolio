# 🚢 Titanic Survival Classification – Predictive Analytics

## 📌 Overview
This project uses the classic **Titanic dataset** to build predictive models that classify passenger survival. The work applies **predictive analytics and machine learning** to identify key survival factors, engineer features, and test classification models.  

The aim was to compare **Decision Tree** and **Neural Network** classifiers to understand model performance on structured data.

---

## 🛠️ Tools & Technologies
- **Python** (Pandas, NumPy, Scikit-learn, Seaborn, Matplotlib)  
- **Predictive Analytics** – classification, feature engineering, survival analysis  
- **Machine Learning Models** – Decision Tree, Neural Network (MLPClassifier)  

---

## 🔍 Key Insights
- **Gender and Class** strongly influenced survival – more women and 1st-class passengers survived.  
- Feature engineering (e.g., **titles from names**) improved model accuracy.  
- **Decision Tree** offered interpretability, while **Neural Network** achieved competitive accuracy.  
- Final model accuracies:  
  - Decision Tree: ~78%  
  - Neural Network: ~82%  

---

## 📊 Analysis Components
1. **Exploratory Data Analysis** – survival rates by gender, class, family size, and embarkation.  
2. **Feature Engineering** – title extraction, categorical encoding, binning (Age, Fare).  
3. **Modeling** – Decision Tree vs Neural Network classifiers.  
4. **Evaluation** – accuracy, confusion matrix, precision, recall, F1-score.  

---

## 📂 Repository Structure
```text
titanic-survival-classification/
├─ README.md
├─ data/   #sourced from Kaggle.com
│  └─ test.csv
   └─ train.csv
   └─ gender_submission.csv
├─ notebooks/
│  ├─ titanic_classification.py
│  └─ titanic_survival_analysis.ipynb
└─ visuals/
   ├─ survival_by_gender.png
   ├─ decision_tree.png
   └─ neural_net_accuracy.png
