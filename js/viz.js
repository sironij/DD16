// console.log("Robert's got a quick hand");
let ch = window.innerHeight / 100;
let cw = window.innerWidth / 100;
let height = 80 * ch;
let width = 70 * cw;
let padding = window.innerWidth * 0.05;
console.log("ciao funzia")
let svg = d3.select('#my_dataviz').append('svg')
  .attr('width', width)
  .attr('height', height)


// console.log("He's got a rolled cigarette")


let colors = d3.scaleOrdinal()
  .domain(["Group1", "Group2", "Group3", "Group4", "Group5", "Group6", "Group7", "Group8", "Group9"])
  .range(["red", "green", "blue", "yellow", "orange", "pink", "cyan", "grey", "magenta"]);

// console.log("Hanging out his mouth, he's a cowboy kid")
///////////// Scale point

// let configPhase = ({
//   domain: ["phase1","phase2","phase3"],
//   paddingpoints: 5,
//   round: true,
//   range: [0+padding, width-padding] /
// })
// let configGroup = ({
//   domain: ["Group1","Group2","Group3","Group4","Group5","Group6","Group7","Group8","Group9"], //
//   paddingpoints: 10,
//   round: true,
//   range: [0+padding, 200, 600, width-padding]
// })

// let x = d3.scalePoint()
// .domain(configPhase.domain)
// .range(configPhase.range)
// .padding(configPhase.paddingpoints)
// .round(configPhase.round)

///////////// Scale point

let x = d3.scaleOrdinal()
  .domain(["phase1", "phase2", "phase3"])
  .range([20 + padding, 700 + padding, 400 + padding]);

let x1 = d3.scaleOrdinal()
  .domain(["Group1", "Group2", "Group3", "Group4", "Group5", "Group6", "Group7", "Group8", "Group9"])
  .range([0 + padding, 100 + padding, 200 + padding, 300 + padding, 400 + padding, 500 + padding, 600 + padding, 700 + padding, 800 + padding]);
// let x1 = d3.scaleLinear()
// .range([0+ padding, width - padding]);

// let x2 = d3.scaleLog()
// .range([0 + padding, width - padding]);


// let y0 = d3.scalePoint()
// .domain( function(d) {
//   console.log(d.data)
//   return d.data } )

// Dichiarazione assi
// let phaseAxis = d3.axisBottom(x).tickFormat(d3.format(".0s")).tickSize(height - 20);
// let groupAxis = d3.axisBottom(x1).tickSize(height - 20);


// let locationAxis = d3.axisLeft(y2).ticks().tickSize(width - window.innerWidth * 0.15).tickPadding(10);


// starting visualization with:

let data_setX = "group";

let y1 = d3.scaleOrdinal()
  .domain(["Group1", "Group2", "Group3", "Group4", "Group5", "Group6", "Group7", "Group8", "Group9"])
  .range([100, 500, 150, 450, 200, 400, 250, 350, 300]);

// Parse dataset
// console.log("In his dad's closet, in a box of fun things")

d3.csv("js/density.csv").then(data => {

  // dichiarare asse x e asse y

  // start ticks for animations and transitions

  function tick() {

    d3.selectAll('.circ')
      .attr('x', function(d) {
        // console.log(d.x)
        return d.x
      })
      .attr('y', function(d) {

        return d.y
      })

  };
  x.domain(d3.extent(data, function(d) {
    // console.log(d.phase)
    return d.phase;
  }));

  x1.domain(d3.extent(data, function(d) {
    // console.log(d.group)
    return d.group;
  }));
  // Draw axes

  // svg.append("g")
  // .call(dateAxis)
  // .classed("xAxis", true);



  // Draw circles

  svg.selectAll('.circ')
    .data(data)
    .enter()
    .append('image').classed('circ', true)
    .attr('width', 50)
    .attr('height', 50)
    .attr('x', function(d) {
      // console.log(x(d.phase))
      return x1(d.group) - 20;
    })
    .attr('y', function(d) {
      return y1(d.group) - 20
    })
    .attr("href", function(d) {
      return d.img;
    })
    .call(d3.drag() // call specific function when circle is dragged
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))

  //fill with image
  // var defs = svg.append('svg:defs');



  //           svg.selectAll('.circ')
  //           .data(data)
  //           .enter()
  //           .append('circle').classed('circ', true)
  //           .attr('r', 15)
  //           .attr('cx', function(d){
  //             // console.log(x(d.phase))
  //             return x1(d.group); })
  //           .attr('cy', function(d){ return y1(d.group); })

  //           .attr("background-image", function(d) {
  //             return "url("+"'"+d.img+"'+)" ;})
  //             .call(d3.drag() // call specific function when circle is dragged
  //             .on("start", dragstarted)
  //             .on("drag", dragged)
  //             .on("end", dragended))


  // .style("fill", "#fff")
  // .style("fill", "url(#grump_avatar" + i + ")");







  d3.selectAll(".circ").on("mouseenter", hover)
  d3.selectAll(".circ").on("mouseleave", outer)




  // Start force layout
  let simulation = d3.forceSimulation(data)
    .force('x', d3.forceX(function(d) {
      // console.log("x " + x(d[data_setX]))
      // console.log("d " + d[data_setX])
      // console.log("val " + data_setX)


      return x1(d.group)
    }).strength(0.99))
    .force('y', d3.forceY(function(d) {
      return y1(d.group)
    }).strength(0.80))
    .force('collide', d3.forceCollide(30)
      .iterations(32))
    .alphaDecay(0)
    .alpha(0.1)
    .on('tick', tick)

  let init_decay;
  init_decay = setTimeout(function() {
    console.log('init alpha decay')
    simulation.alphaDecay(0.1);
  }, 5000);



  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

  d3.selectAll('.bottone').on('click', function() {
    // console.log("But he's coming for you, yeah, he's coming for you")
      d3.selectAll('.bottone').removeClass(".filter-active")
      d3.select(this).addClass(".filter-active")

      
    data_setX = this.id;
      


    simulation.force('y', d3.forceY(function(d) {

      if (data_setX === "phase") {
        return height / 2
      } else {
        return y1(d.group)
      }
    }))

    simulation.force('x', d3.forceX(function(d) {
      if (data_setX == "phase") {
        //   console.log("All the other kids with the pumped up kicks")
        return x(d.phase)

      } else {
        //   console.log("You better run, better run, outrun my gun")

        return x1(d.group)
      }
    }))

    simulation
      .alphaDecay(0)
      .alpha(0.5)
      .restart()
  })

})

let tooltip = d3.select("#tooltip").style("opacity", 1)


function hover(d) {


  d3.selectAll(".circ").style("opacity", 0.2)
  d3.select(this).style("opacity", 1)



  tooltip.append("p")
    .text("The project for " + d.phase)

  tooltip.append("p")
    .text("by " + d.group)

  tooltip.append("p")
    .text("is titled " + d.title)

}

function outer() {

  d3.selectAll(".circ").style("opacity", 1)
  d3.selectAll("#tooltip p").remove()
}
var config = {
  "avatar_size": 10 //define the size of teh circle radius
}
// data.forEach(function(d, i) {
//   defs.append("svg:pattern")
//     .attr("id", "grump_avatar" + i)
//     .attr("width", config.avatar_size)
//     .attr("height", config.avatar_size)
//     .attr("patternUnits", "userSpaceOnUse")
//     .append("svg:image")
//     .attr("xlink:href", d.img)
//     .attr("width", config.avatar_size)
//     .attr("height", config.avatar_size)
//     .attr("x", 0)
//     .attr("y", 0);

//   var circle = svg.append("circle")
//     .attr("transform", "translate(" + d.posx + "," + d.posy + ")")
//     .attr("cx", config.avatar_size / 2)
//     .attr("cy", config.avatar_size / 2)
//     .attr("r", config.avatar_size / 2)
//     .style("fill", "#fff")
//     .style("fill", "url(#grump_avatar" + i + ")");

// })
