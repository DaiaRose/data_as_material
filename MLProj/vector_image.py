import os
import torch
from torchvision import models, transforms
from PIL import Image
from pathlib import Path
import numpy as np
from sklearn.decomposition import PCA
import umap
import pandas as pd
from tqdm import tqdm

print("🔄 Starting 2D embedding generation…")

# === Settings ===
IMAGE_DIR = "CircusImages"            # Folder with your cleaned images
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
PCA_COMPONENTS = 30                    # Number of PCA dims before UMAP
UMAP_COMPONENTS = 2                    # Final 2D embedding
OUTPUT_CSV = "vector_results.csv"     # Save filename -> x, y

# === Model Setup ===
resnet = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
feature_extractor = torch.nn.Sequential(*list(resnet.children())[:-1]).to(DEVICE)
feature_extractor.eval()

# === Preprocessing ===
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# === Discover images ===
paths = list(Path(IMAGE_DIR).glob("*.jpg"))
print(f"Found {len(paths)} .jpg files in {IMAGE_DIR}")

# === Extract embeddings ===
embeddings, filenames = [], []
with torch.no_grad():
    for img_path in tqdm(paths, desc="Extracting features"):
        img = Image.open(img_path).convert("RGB")
        tensor = preprocess(img).unsqueeze(0).to(DEVICE)
        feat = feature_extractor(tensor)
        feat = feat.view(feat.size(0), -1).cpu().numpy()
        embeddings.append(feat.squeeze())
        filenames.append(img_path.name)
embeddings = np.stack(embeddings)

# === PCA reduction ===
print("📊 Reducing to", PCA_COMPONENTS, "dimensions via PCA…")
pca = PCA(n_components=PCA_COMPONENTS)
pca_embeddings = pca.fit_transform(embeddings)

# === UMAP to 2D ===
print(f"🔬 Computing UMAP to {UMAP_COMPONENTS} dimensions…")
reducer = umap.UMAP(n_components=UMAP_COMPONENTS, random_state=42)
coords = reducer.fit_transform(pca_embeddings)

# === Save 2D coordinates ===
print(f"💾 Saving 2D coordinates to {OUTPUT_CSV}…")
df = pd.DataFrame({
    "filename": filenames,
    "x": coords[:, 0],
    "y": coords[:, 1]
})
df.to_csv(OUTPUT_CSV, index=False)

print("✅ 2D embedding complete! Results saved to", OUTPUT_CSV)
