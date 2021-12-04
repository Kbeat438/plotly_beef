function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
      var filteredArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.

      var resultBar = filteredArray[0];

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    
    // Create a variable that holds the first sample in the array.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResultsGauge = metadataArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var PANEL = d3.select("#sample-metadata");  
    var otu_ids = resultBar.otu_ids
    var otu_labels = resultBar.otu_ids
    var sample_values = resultBar.sample_values

     // 3. Create a variable that holds the washing frequency.
     var washing_frequency = metaResultsGauge.wfreq;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",

      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {

     title: "top 10 bacteria",
     xaxis: {title: "Bacteria levels" },
     yaxis: {title: "OTU's"},

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
// bubble chart 

     // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
      x: otu_ids,
      y: sample_values,
      hovertext: otu_ids,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_labels,
        colorscale: "burg"
        }
      }
   
    ];
    
        // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria per sample",
      margin: { x: 0 },
      margin: { x: 50},
      hovermode: "closest",
      xaxis: { title: "OTU's" }
      
          
    };
    
      // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData,bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washing_frequency,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b> belly button washing frequency </b>" },
      gauge: {
        axis: { range: [null, 10], tickwidth: 2, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }
        ],
        
      },
      }];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 500, height: 500, 
        margin: { x: 0, y: 0 },
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
  }