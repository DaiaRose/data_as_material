import cadquery as cq

# Create a simple box: width=10mm, depth=20mm, height=5mm
result = cq.Workplane("XY").box(10, 20, 5)

# Export it as an STL file
cq.exporters.export(result, "box_output.stl")
