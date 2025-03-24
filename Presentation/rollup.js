d3.csv("bugs.csv", d3.autoType).then(data => {

    // Get total counts by family
    const familyCounts = d3.rollup(
      data,
      v => d3.sum(v, d => d.individuals),
      d => d.family
    );
  
    // Top 3 families overall
    const top3Families = Array.from(familyCounts)
      .sort((a, b) => d3.descending(a[1], b[1]))
      .slice(0, 3)
      .map(([family]) => family);
  
    // Prepare cumulative data
    const cumulativeRows = [];
  
    top3Families.forEach(family => {
      const yearlyCounts = d3.rollups(
        data.filter(d => d.family === family),
        v => d3.sum(v, d => d.individuals),
        d => d.year
      ).sort((a, b) => d3.ascending(a[0], b[0]));
  
      let cumulative = 0;
      yearlyCounts.forEach(([year, count]) => {
        cumulative += count;
        cumulativeRows.push({family, year, cumulative});
      });
    });
  
    // Convert data to CSV
    const csvContent = d3.csvFormat(cumulativeRows);
  
    // Create download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(new Blob([csvContent], {type: "text/csv"}));
    downloadLink.download = "cumulative_bug_counts.csv";
    downloadLink.textContent = "Download cumulative_bug_counts.csv";
    downloadLink.style.display = "block";
    downloadLink.style.margin = "20px";
    document.body.prepend(downloadLink);
  
  });
  