import cadquery as cq

# --- Fake year & population data: (x = year, y = population) ---
raw_data = [
    (0, 1),
    (1, 2),
    (2, 2),
    (3, 4),
    (4, 2),
    (5, 6),
    (6, 8),
    (7, 6),
    (8, 2),
]

scale = 10  # scale everything for printability

# --- Build profile in XY plane ---
points = [(x * scale, y * scale) for x, y in raw_data]
points.append((raw_data[-1][0] * scale, 0))  # close bottom
points.insert(0, (raw_data[0][0] * scale, 0))

# --- Create profile in XY and revolve around X-axis ---
profile = cq.Workplane("XY").polyline(points).close()
solid = profile.revolve(axisStart=(0, 0, 0), axisEnd=(1, 0, 0))  # revolve around X

# --- Export STL ---
cq.exporters.export(solid, "population_revolve_x_axis.stl")
