async function getData() {
  // data
  const dataset = await d3.json('data.json')
  
  // in genral the x axis of scaler plot is cause and y axis is effect
  // so in this case x axis is percentage and y axis is sgpa

  // accessors
  const xAccessor = (d) => d['attendance%']
  const yAccessor = (d) => d['sgpa']

  // dimensions
  let dimensions = {
    width: document.getElementById("chart").offsetWidth,
    height: document.getElementById("chart").offsetHeight,
    margin: {
      top : 50,
      right : 50,
      bottom : 60,
      left : 50,
    }
  }

  dimensions.ctrWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.ctrHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;


  const svg = d3.select("#chart")
              .append('svg')
              .attr("height", dimensions.height)
              .attr("width", dimensions.width)

  const ctr = svg.append('g') // g
              .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)

  // scales
  const xScale = d3.scaleLinear()
                 .domain(d3.extent(dataset, xAccessor))
                 .rangeRound([0, dimensions.ctrWidth])
                 .nice()
                 .clamp(true)
  const yScale = d3.scaleLinear()
                 .domain(d3.extent(dataset, yAccessor))
                 .rangeRound([dimensions.ctrHeight, 0])
                 .nice()
                 .clamp(true)

// draw circles
  ctr.selectAll('circle')
      .data(dataset)
      .join('circle')
      .attr('cx', d => xScale(xAccessor(d)))
      .attr('cy', d => yScale(yAccessor(d)))
      .attr('data-temp', yAccessor)
      .attr('r', 5)
      .attr('fill', 'red')

  // axes
  const xAxis = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d => d + "%")

  const xAxisGroup = ctr.append("g")
      .call(xAxis)
      .style("transform", `translateY(${dimensions.ctrHeight}px)`)
      .classed('axis', true)
  
  xAxisGroup.append("text")
    .attr("x", dimensions.ctrWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .text("Attendance %")
    .style("text-anchor", "middle")

  const yAxis = d3.axisLeft(yScale)
        .ticks(5)

  const yAxisGroup = ctr.append("g")
        .call(yAxis)
        .classed('axis', true)

  yAxisGroup.append("text")
    .attr("x", -dimensions.ctrHeight/2)
    .attr("y", -dimensions.margin.left + 18)
    .attr("fill", "black")
    .text("SGPA")
    .style("text-anchor", "middle")
    .style("transform", "rotate(270deg)")
  
}

getData()