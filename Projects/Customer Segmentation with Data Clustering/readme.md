# 🛒 Customer Segmentation with Clustering

## 📌 Overview
This project applies **unsupervised machine learning** techniques to segment wholesale customers based on their purchasing behavior. Using spending data across product categories (Fresh, Milk, Grocery, Frozen, and Delicassen), clustering models uncover distinct customer groups that can inform **marketing and business strategies**.  

Both **K-Means** and **Hierarchical Clustering** were implemented and compared to evaluate cluster quality and interpretability.

---

## 🛠️ Tools & Techniques
- **Python** (Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn)  
- **Unsupervised Learning** – K-Means, Hierarchical Clustering  
- **Model Evaluation** – Elbow Method, Silhouette Score  
- **Data Visualization** – 2D cluster plots, dendrograms  

---

## 🔍 Key Insights
- **Optimal Clusters**: Both Elbow Method and Silhouette Score suggested **3 clusters**.  
- **Cluster Profiles**:  
  - *Cluster 0*: Low spenders across all categories – likely small buyers or budget-conscious individuals.  
  - *Cluster 1*: High Fresh & Frozen spending – restaurants/caterers dependent on perishables.  
  - *Cluster 2*: High Milk, Grocery, Delicassen spending – retailers and distributors stocking non-perishables.  
- **K-Means vs Hierarchical**:  
  - K-Means performed better (Silhouette = 0.42) compared to Hierarchical (Silhouette = 0.30).  
- **Business Application**: Targeted promotions, loyalty programs, and channel-specific campaigns can be designed per cluster.  

---

## 📊 Analysis Components
1. **Data Preprocessing** – feature scaling to standardize spending values.  
2. **K-Means Clustering** – cluster formation + Elbow Method + Silhouette Score.  
3. **Hierarchical Clustering** – dendrogram analysis with Ward’s linkage.  
4. **Comparison & Business Insights** – interpreting segments for strategic applications.  

---

## 📂 Repository Structure
```text
customer-segmentation-clustering/
├─ README.md
├─ data/
│  └─ wholesale_customers.csv         # Dataset (UCI Wholesale Customers dataset)
├─ notebooks/
│  └─ customer_segmentation.ipynb     # End-to-end analysis in Python
└─ visuals/
   ├─ elbow_curve.png
   ├─ silhouette_scores.png
   ├─ kmeans_clusters.png
   ├─ hierarchical_dendrogram.png
