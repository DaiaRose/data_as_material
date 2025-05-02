
# This script clusters images of fonts using K-Means clustering after extracting features with a pre-trained ResNet50 model.
# It uses PCA for dimensionality reduction and saves the results to a CSV file.

import os
import torch
from torchvision import models, transforms
from PIL import Image
from pathlib import Path
import numpy as np
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
# import hdbscan  # no longer needed unless you want HDBSCAN fallback
import pandas as pd
from tqdm import tqdm

print("🔄 Starting font clustering (K-Means)…")

# === Settings ===
IMAGE_DIR = "CircusImages"   # Folder with your cleaned images
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
PCA_COMPONENTS = 30           # Number of PCA dimensions to keep
KMEANS_CLUSTERS = 8        # Number of forced clusters (adjust as desired)

# === Model Setup ===
resnet = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
feature_extractor = torch.nn.Sequential(*list(resnet.children())[:-1]).to(DEVICE)
feature_extractor.eval()

# === Preprocessing ===
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# === Discover images ===
paths = list(Path(IMAGE_DIR).glob("*.jpg"))
print(f"Found {len(paths)} .jpg files in {IMAGE_DIR}")

# === Extract embeddings ===
embeddings, filenames = [], []
with torch.no_grad():
    for img_path in tqdm(paths, desc="Extracting embeddings"):
        img = Image.open(img_path).convert("RGB")
        tensor = preprocess(img).unsqueeze(0).to(DEVICE)
        feat = feature_extractor(tensor)
        feat = feat.view(feat.size(0), -1).cpu().numpy()
        embeddings.append(feat.squeeze())
        filenames.append(img_path.name)
embeddings = np.stack(embeddings)

# === PCA reduction ===
print("📊 Running PCA dimensionality reduction…")
pca = PCA(n_components=PCA_COMPONENTS)
pca_embeddings = pca.fit_transform(embeddings)

# === K-Means clustering ===
print(f"🤖 Running K-Means with {KMEANS_CLUSTERS} clusters…")
km = KMeans(n_clusters=KMEANS_CLUSTERS, random_state=42)
labels = km.fit_predict(pca_embeddings)

# === Save Results ===
output_csv = "cluster_results.csv"
df = pd.DataFrame({"filename": filenames, "cluster": labels})
df.to_csv(output_csv, index=False)
print(f"✅ Clustering complete! Results saved to {output_csv}")

