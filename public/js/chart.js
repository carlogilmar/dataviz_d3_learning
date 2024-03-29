async function drawLineChart() {
  const dataset = await d3.json("./../data/data.json")

  const parseDate = d3.timeParse("%Y-%m-%d")
  const yAccesor = d => d["temperatureMax"]
  const xAccesor = d => parseDate(d["date"])

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60
    }
  }

  dimensions.boundedWidth =
    dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right

  dimensions.boundedHeight =
    dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  const wrapper =
    d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const bounds =
    wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px,
        ${dimensions.margin.top}px)`)

  const yScale =
      d3.scaleLinear()
      .domain(d3.extent(dataset, yAccesor))
      .range([dimensions.boundedHeight, 0])

  const freezingTemperaturePlacement = yScale(32)
  const freezingTemperatures =
    bounds
    .append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr("fill", "#E0F3F3")

  const xScale =
    d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccesor))
    .range([0, dimensions.boundedWidth])

  const lineGenerator = d3.line()
    .x(d => xScale(xAccesor(d)))
    .y(d => yScale(yAccesor(d)))

  const line =
    bounds
    .append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "#AF9358")
    .attr("stroke-width", 2)

  const yAxisGenerator = d3.axisLeft().scale(yScale)
  const yAxis = bounds.append("g").call(yAxisGenerator)
  const xAxisGenerator = d3.axisBottom().scale(xScale)
  const xAxis =
    bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)


}

drawLineChart();
