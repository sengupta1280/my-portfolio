import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
import scipy.cluster.hierarchy as sch
from scipy.cluster.hierarchy import dendrogram, linkage
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score

#Task 1: Data Pre-processing
# Load data
df = pd.read_csv("Wholesale customers data - B.csv")

from sklearn.preprocessing import StandardScaler

# Specify the columns with numerical data (exclude 'Channel' and 'Region')
features = ['Fresh', 'Milk', 'Grocery', 'Frozen', 'Delicassen']

# Initialize and apply the standard scaler
scaler = StandardScaler()
scaled_features = scaler.fit_transform(df[features])

# Convert scaled data back into a DataFrame for easier handling
scaled_df = pd.DataFrame(scaled_features, columns=features)

#Export file to csv
scaled_df.to_csv('scaled_data.csv', index=False)

#Display scaled data head
print("\nScaled Data for Clustering:\n", scaled_df.head())

#Task 2.1 Implementing K-means

# Elbow method to find the optimal number of clusters
inertia_values = []
cluster_range = range(1, 11)
for num_clusters in cluster_range:
    kmeans_model = KMeans(n_clusters=num_clusters, random_state=42)
    kmeans_model.fit(scaled_df)
    inertia_values.append(kmeans_model.inertia_)

# Plot the elbow curve
plt.figure(figsize=(8,5))
plt.plot(cluster_range, inertia_values, 'bo-', label='Inertia')
plt.xlabel('Number of clusters (k)')
plt.ylabel('Inertia')
plt.title('Elbow Curve to Determine Optimal k')
plt.legend()
plt.show()

# Compute Silhouette scores for different cluster sizes
silhouette_scores = []
for num_clusters in range(2, 11):
    kmeans_model = KMeans(n_clusters=num_clusters, random_state=42)
    cluster_labels = kmeans_model.fit_predict(scaled_df)
    silhouette_scores.append(silhouette_score(scaled_df, cluster_labels))

# Plot silhouette scores
plt.figure(figsize=(8,5))
plt.plot(range(2, 11), silhouette_scores, 'bo-', label='Silhouette Score')
plt.xlabel('Number of clusters (k)')
plt.ylabel('Silhouette Score')
plt.title('Silhouette Score for Optimal Cluster Count')
plt.legend()
plt.show()

# Perform PCA for dimensionality reduction to 2 components
pca = PCA(n_components=2)
data_pca = pca.fit_transform(scaled_df)

# Fit KMeans with 3 clusters and visualize the result
optimal_kmeans = KMeans(n_clusters=3, random_state=42)
cluster_labels = optimal_kmeans.fit_predict(scaled_df)

plt.figure(figsize=(8,6))
plt.scatter(data_pca[:, 0], data_pca[:, 1], c=cluster_labels, cmap='plasma')
plt.title('2D Visualization of Clusters using K-Means')
plt.xlabel('PCA Component 1')
plt.ylabel('PCA Component 2')
plt.show()

# Generate the linkage matrix using Ward's method for hierarchical clustering
link_matrix = linkage(scaled_df, method='ward')

#Task 2.2- Implementing Hierarchical Clustering using Dendogram

# Plot the dendrogram
plt.figure(figsize=(10, 7))
plt.title("Dendrogram for Hierarchical Clustering")
dendrogram(link_matrix)
plt.xlabel('Sample Index')
plt.ylabel('Distance')
plt.show()

# Use K-Means with the determined number of clusters (3)
final_kmeans = KMeans(n_clusters=3, random_state=42)
final_cluster_labels = final_kmeans.fit_predict(scaled_df)

# Display K-Means cluster centroids
centroids_df = pd.DataFrame(final_kmeans.cluster_centers_, columns=scaled_df.columns)
print("Cluster Centroids from K-Means:\n", centroids_df)

# Summarize the centroids for each cluster
for idx, centroid in centroids_df.iterrows():
    print(f"Cluster {idx}:")
    print(f"Fresh: {centroid['Fresh']:.2f}, Milk: {centroid['Milk']:.2f}, Grocery: {centroid['Grocery']:.2f}, Frozen: {centroid['Frozen']:.2f}, Delicassen: {centroid['Delicassen']:.2f}")
    print("----\n")


# Perform hierarchical clustering and cut the dendrogram at 3 clusters
from scipy.cluster.hierarchy import fcluster
hierarchical_cluster_labels = fcluster(link_matrix, 3, criterion='maxclust')

# Assign hierarchical cluster labels to the data and calculate centroids
hierarchical_df = pd.DataFrame(scaled_df, columns=scaled_df.columns)
hierarchical_df['Cluster'] = hierarchical_cluster_labels
hierarchical_centroids = hierarchical_df.groupby('Cluster').mean()

# Display centroids for hierarchical clustering
print("Cluster Centroids from Hierarchical Clustering:\n", hierarchical_centroids)

#Task 3- Comparing Silhouette Scores

# Compute and compare silhouette scores
kmeans_silhouette = silhouette_score(scaled_df, final_cluster_labels)
hierarchical_silhouette = silhouette_score(scaled_df, hierarchical_cluster_labels)

print("Silhouette Score for K-Means:", kmeans_silhouette)
print("Silhouette Score for Hierarchical Clustering:", hierarchical_silhouette)


#Task 4-  Performing Supervised Methods using SVM

# Add SVM implementation with Region as target
# Preparing the data for SVM
# Separating features and target (Region) for supervised learning (SVM)
X = scaled_df  # Using the scaled features
y = df['Region']  # Assuming 'Region' exists in the original dataset

# Split the data into training and testing sets, 70-30 (for SVM)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Implement SVM for predicting Region
svm_model = SVC(kernel='linear', random_state=42)
svm_model.fit(X_train, y_train)

# Make predictions and evaluate the model
y_pred = svm_model.predict(X_test)

# Evaluate model performance metrics for SVM
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted')
recall = recall_score(y_test, y_pred, average='weighted')

# Display SVM classification metrics
print("\nSVM Classification Metrics:")
print(f"Accuracy: {accuracy:.2f}")
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")

#K-Means Analysis (using the original clusters to match regions)
#Analyzing the overlap between K-Means clusters and 'Region'
hierarchy_cluster_vs_region = pd.crosstab(hierarchical_df['Cluster'], df['Region'])

print("Hierarchical Clustering vs. Region Mapping:")
print(kmeans_cluster_vs_region)

