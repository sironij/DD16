
let ch = window.innerHeight / 100;
let cw = window.innerWidth / 100;
let height = 80 * ch;
let width = 70 * cw;
let padding = window.innerWidth * 0.05;
console.log("ciao funzia")
let svg = d3.select('#my_dataviz').append('svg')
  .attr('width', width)
  .attr('height', height)

let colors = d3.scaleOrdinal()
  .domain(["Group1", "Group2", "Group3", "Group4", "Group5", "Group6", "Group7", "Group8", "Group9"])
  .range(["red", "green", "blue", "yellow", "orange", "pink", "cyan", "grey", "magenta"]);

let x = d3.scaleOrdinal()
  .domain(["phase1", "phase2", "phase3"])
  .range([0 + padding, ((width/3)*3) + padding,((width/3)*1.5) + padding]);

let x1 = d3.scaleOrdinal()
  .domain(["Group1", "Group2", "Group3", "Group4", "Group5", "Group6", "Group7", "Group8", "Group9"])
  .range([0 + padding,rnd((width/9)) + padding, rnd(width)  + padding, rnd((width/9)*2)  + padding, rnd((width/9)*3)  + padding, rnd((width/9)*4)  + padding, rnd((width/9)*5) + padding, rnd((width/9)*6)  + padding, rnd((width/9)*7) + padding]);


function rnd( max) {
  return Math.random() * (max);
}

// starting visualization with:

let data_setX = "group";

let y1 = d3.scaleOrdinal()
  .domain(["Group1", "Group2", "Group3", "Group4", "Group5", "Group6", "Group7", "Group8", "Group9"])
  .range([height/9,height/9*1.5,height/9*3,height/9*4.5,height/9*6,hieght/9*7.5,height,350,300]);

var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip");





// Parse dataset
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
      .on("end", dragended));
       
    d3.selectAll(".circ")
    .on("mouseover", function(d) {   
    console.log("tooltip" + tooltip)
    tooltip.html(d)  
      .style("left", (d3.event.pageX) + "px")     
      .style("top", (d3.event.pageY - 28) + "px")
      .style("opacity", 100);
  })                  
  .on("mouseout", function(d) {       
    tooltip.style("opacity", 0);   
  });


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
    .force('collide', d3.forceCollide(25)
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
      d3.selectAll('.bottone').classed("filter-active",false)
      d3.select(this).classed("filter-active",true)

      
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




var chartDiv = document.getElementsByClassName("visualizzazione");

function redraw(){
console.log("ridisegno")
        // Extract the width and height that was computed by CSS.
        var width2 = chartDiv.clientWidth;
        var height2 = chartDiv.clientHeight;

        // Use the extracted size to set the size of an SVG element.
        svg
          .attr("width", width2)
          .attr("height", height2);

        // Draw an X to show that the size is correct.
       
      }

 redraw();

      // Redraw based on the new size whenever the browser window is resized.
      window.addEventListener("resize", redraw);
