console.log("Example 3")

async function drawChart() {
  // 1. Data
  const data = await d3.json("./../data/data.json")
  const xAccessor = d => d.humidity
	const yAccessor = d => d.length

  // 2. Chart dimesions
  const width = 600
  let dimensions = {
    width,
    height: width * 0.6,
    margin: {
      top: 30,
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
	const wrapper = d3.select("#wrapper_barchar")
		.append("svg")
		.attr("width", dimensions.width)
		.attr("height", dimensions.height)

	const bounds = wrapper.append("g")
		.style("transform", `translate(${
			dimensions.margin.left
		}px, ${
			dimensions.margin.top
		}px)`)

	// 4. Create scales
	const xScale = d3.scaleLinear()
		.domain(d3.extent(data, xAccessor))
		.range([0, dimensions.boundedWidth])
		.nice()

	const binsGenerator = d3.bin()
		.domain(xScale.domain())
		.value(xAccessor)
		.thresholds(12)

	const bins = binsGenerator(data)

	const yScale = d3.scaleLinear()
		.domain([0, d3.max(bins, yAccessor)])
		.range([dimensions.boundedHeight, 0])
		.nice()

  // 5. Draw data
  const binsGroup = bounds.append("g")

  const binGroups = binsGroup.selectAll("g")
    .data(bins)
    .join("g")

  const barPadding = 1
  const barRects = binGroups.append("rect")
      .attr("x", d => xScale(d.x0) + barPadding / 2)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", d => d3.max([
        0,
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))
      .attr("height", d => dimensions.boundedHeight
        - yScale(yAccessor(d))
      )
      .attr("fill", "cornflowerblue")

	// 6. Labels
  const barText = binGroups.filter(yAccessor)
    .append("text")
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", d => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style("text-anchor", "middle")
      .attr("fill", "darkgrey")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")

  // 6. Draw peripherals

  const mean = d3.mean(data, xAccessor)
  const meanLine = bounds.append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "maroon")
      .attr("stroke-dasharray", "2px 4px")

  const meanLabel = bounds.append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text("mean")
      .attr("fill", "maroon")
      .style("font-size", "12px")
      .style("text-anchor", "middle")
      .style("font-family", "sans-serif");

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Humidity")
}

drawChart();

