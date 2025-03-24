d3.csv("cumulative_bug_counts.csv", d3.autoType).then(data => {

  const families = Array.from(new Set(data.map(d => d.family)));

  const yearExtent = d3.extent(data, d => d.year);
  const maxCumulative = d3.max(data, d => d.cumulative);

  const width = 1728; //24 inches in illustrator
  const height = 1296;  //18 inches in illustrator
  const margin = {top: 10, right: 10, bottom: 10, left: 10};

  const x = d3.scaleLinear()
              .domain([yearExtent[0], yearExtent[1]])
              .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
              .domain([0, maxCumulative])
              .range([height - margin.bottom, margin.top]);

  families.forEach(family => {

    const familyData = data.filter(d => d.family === family);

    // Points for closed shape (area beneath the line)
    const closedData = [
      [x(yearExtent[0]), y(0)],
      ...familyData.map(d => [x(d.year), y(d.cumulative)]),
      [x(yearExtent[1]), y(0)]
    ];

    const svg = d3.select('body')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)

    svg.append("path")
       .attr("d", d3.line()(closedData) + "Z")
       .attr("fill", "none") //no fill for vector cut
       .attr("stroke", "#0000FF") //blue for vector cut
       .attr("stroke-width", .001); //print size
      //  .attr("stroke-width", 1); //larger view


       // Add SVG download link
    const svgNode = svg.node();
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);

    const blob = new Blob([svgString], {type:"image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${family}_cumulative.svg`;
    downloadLink.textContent = `Download ${family}.svg`;
    downloadLink.style.display = "block";
    downloadLink.style.margin = "5px 0";

    document.body.appendChild(downloadLink);

  });



});

