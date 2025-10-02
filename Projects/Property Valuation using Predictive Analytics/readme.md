# 🏡 Property Valuation – Predictive Analytics with Regression & Decision Trees

## 📌 Overview
This project estimates US housing **sale prices** using **predictive analytics**.  
It covers data preparation, feature engineering, and supervised learning with **Linear Regression** and **Decision Trees** to identify which variables most influence property value.

---

## 🛠️ Tools & Technologies
- **R** (base, stats, rpart, ggplot2)  
- **Predictive Modeling** – Linear Regression, Decision Trees (with pruning)  
- **Data Engineering** – handling missing values, skewness correction, encoding

---

## 🔍 Key Findings
- Strongest predictors of price include **Living Area, Overall Quality, Garage Cars**, and **Year Built**.  
- Log transforms reduced skewness for **SalePrice** and **LivingArea**.  
- **Model performance (RMSE, test set):**
  - Linear Regression: ~**29,111**
  - Decision Tree (pruned, CP = 0.04): ~**50,997**
- **Conclusion:** Linear Regression outperformed Decision Trees on this dataset.

---

## 📊 What’s Inside
1. **EDA** – distributions, outliers (boxplots), correlations  
2. **Preprocessing** – missing values (mean/zero/drop), log transforms, categorical encoding  
3. **Modeling** – OLS regression, Decision Tree + pruning (CP grid)  
4. **Evaluation** – RMSE comparison, actual vs predicted plot

---

## 📂 Repository Structure
```text
real-estate-price-prediction/
├─ README.md
├─ data/
│  └─ housing_data.csv                 # dataset used for modeling
├─ scripts/
│  └─ modeling.R                       # end-to-end pipeline (EDA → Models → Plots)
├─ visuals/
│  ├─ histograms.png
│  ├─ boxplots.png
│  ├─ correlation_heatmap.png
│  ├─ regression_actual_vs_pred.png
│  └─ decision_tree.png
└─ docs/
   └─ Property_Valuation_Report.pdf    # final report (your PDF)
