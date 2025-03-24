import cadquery as cq
import csv
from collections import defaultdict

# --- Config ---
csv_path = "cumulative_bug_counts.csv"
scale_x = 1.0       # horizontal scale (year spacing)
scale_z = 1 / 1000  # vertical scale (height from cumulative)
thickness_y = 5     # extrusion thickness for each shape
gap_z = 10          # vertical gap between families

# --- Read and group data ---
data_by_family = defaultdict(list)

with open(csv_path) as f:
    reader = csv.DictReader(f)
    for row in reader:
        year = int(row["year"])
        cumulative = int(row["cumulative"])
        family = row["family"]
        data_by_family[family].append((year, cumulative))

# --- Sort each family by year ---
for family in data_by_family:
    data_by_family[family].sort(key=lambda x: x[0])

# --- Build mountain shapes ---
model = cq.Workplane("XY")

for i, (family, points) in enumerate(data_by_family.items()):
    # Prepare 2D outline
    outline = []

    # Start at (first year, 0)
    start_year = points[0][0]
    outline.append((start_year * scale_x, 0))

    # Go through data points
    for year, cumulative in points:
        x = year * scale_x
        z = cumulative * scale_z
        outline.append((x, z))

    # End at (last year, 0)
    end_year = points[-1][0]
    outline.append((end_year * scale_x, 0))

    # Create the 2D wire (polygon)
    wire = cq.Workplane("XZ").polyline(outline).close()

    # Extrude to give thickness
    shape = wire.extrude(thickness_y)

    # Offset in Y so families are side by side
    shape = shape.translate((0, i * (thickness_y + 5), 0))

    model = model.union(shape)

# --- Export STL ---
cq.exporters.export(model, "bug_mountain_chart.stl")
