# analyze_clusters.py
import pandas as pd

def main():
    # Load your clustering results
    df = pd.read_csv("cluster_results.csv")

    # 1. Count how many images per cluster (–1 is noise)
    counts = df["cluster"].value_counts().sort_index()
    print("Cluster sizes:")
    print(counts.to_string())

    # 2. (Optional) Save those counts to a CSV
    # counts.to_csv("cluster_counts.csv", header=["count"])

    # 3. Show up to 3 example filenames per cluster
    print("\nSample images per cluster:")
    samples = (
        df.groupby("cluster")["filename"]
          .apply(lambda files: files.sample(min(3, len(files))).tolist())
    )
    for cluster_id, filenames in samples.items():
        print(f"  Cluster {cluster_id}: {filenames}")

if __name__ == "__main__":
    main()
