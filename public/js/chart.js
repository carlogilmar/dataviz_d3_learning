console.log("Hey, I'm the JS script in your template dude!");

async function drawLineChart() {
  console.log("Leyendo perro!")
  const dataset = await d3.json("./../data/data.json")
  console.log(dataset)
}

drawLineChart();
