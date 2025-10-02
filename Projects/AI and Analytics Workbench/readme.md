# 🤖 AI & Analytics Workbench

## 📌 Overview
This project brings together multiple applied analytics and AI techniques, including chatbot development, automated machine learning, and decision tree modeling. The goal is to demonstrate how **cloud platforms, automation, and machine learning** can solve real-world problems in analytics and business intelligence.

---

## 🛠️ Tools & Technologies
- **Google Dialogflow CX** – Conversational AI chatbot design  
- **Azure Machine Learning** – Automated ML pipeline and deployment  
- **Google Colab / Scikit-learn** – Decision tree modeling and evaluation  
- **Python** – Model training, evaluation, and visualization  

---

## 🔍 Project Components
1. **Analytics Tasks Classification**  
   - Understanding descriptive, diagnostic, predictive, and prescriptive analytics through real-world examples.  

2. **Chatbot Development (Dialogflow CX)**  
   - Built a coffee-ordering chatbot with natural conversation flow.  
   - Includes handling user intents, FAQs, and fallback cases.  
   - Future improvements: spelling correction, payment integration.  

3. **AutoML Model Deployment (Azure ML)**  
   - Trained classification models using **AutoML**.  
   - Best model: **Voting Ensemble** with AUC = **0.948**.  
   - Deployed as a real-time endpoint for predictions.  

4. **Decision Tree Modeling (Google Colab)**  
   - Trained and tested a decision tree on classification data.  
   - Achieved **74.4% accuracy** on training data and **82.2% accuracy** on testing data.  
   - Visualized decision tree and feature correlations via heatmap.  

---

## 📂 Repository Structure
```text
ai-analytics-workbench/
├─ README.md
├─ chatbot/
│  ├─ coffee_chatbot_flow.png        # Screenshot of chatbot flow
│  ├─ coffee_chatbot_design.json     # Exported Dialogflow CX agent
├─ automl/
│  ├─ bankmarketing_train.csv        # Training dataset
│  ├─ automl_best_model_summary.png  # Screenshot of Azure ML results
│  ├─ automl_predictions.csv         # Predictions from deployed model
├─ decision-tree/
│  ├─ heart_failure.csv              # Dataset for decision tree
│  ├─ decision_tree_model.ipynb      # Google Colab notebook
│  ├─ decision_tree.png              # Tree visualization
│  ├─ correlation_heatmap.png        # Heatmap of feature correlations
