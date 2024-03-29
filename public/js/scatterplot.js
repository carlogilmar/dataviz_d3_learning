async function drawScatter(){
  // 1. Data access
  const data= await d3.json("./../data/data.json")
  const xAccesor = d => d["dewPoint"]
  const yAccesor = d => d["humidity"]

  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9
  ])

  // 2. Chart Dimensions
  let dimensions = {
    width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50
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

  // 3. Draw canvas
  const wrapper =
    d3
    .select("#wrapper_scatterplot")
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

  // 4. Create Scales
  const xScale =
    d3
    .scaleLinear()
    .domain(d3.extent(data, xAccesor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale =
      d3.scaleLinear()
      .domain(d3.extent(data, yAccesor))
      .range([dimensions.boundedHeight, 0])
      .nice()

  // 5. Draw Data
  const colorAccessor = d => d.cloudCover

  const colorScale = d3.scaleLinear()
      .domain(d3.extent(data, colorAccessor))
      .range(["skyblue", "darkslategrey"])

  const drawDots = (data, color) => {
    const dots =
      bounds
      .selectAll("circle")
      .data(data)

    dots.enter().append("circle")
    .attr("cx", d => xScale(xAccesor(d)))
    .attr("cy", d => yScale(yAccesor(d)))
    .attr("r", 5)
    .attr("fill", d => colorScale(colorAccessor(d)))
  }

  drawDots(data, "gray")

  // 6. Draw peripherals
  const xAxisGenerator =
    d3
    .axisBottom()
    .scale(xScale)

  const xAxis =
    bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel =
    xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew point (&deg;F)")

  const yAxisGenerator =
    d3
    .axisLeft()
    .scale(yScale)
    .ticks(4)

  const yAxis =
    bounds
  .append("g")
  .call(yAxisGenerator)

  const yAxisLabel =
    yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight/ 2)
    .attr("y", -dimensions.margin.left - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Relative humidity")
    .style("transform", "rotate(-90deg)")
}

drawScatter()
