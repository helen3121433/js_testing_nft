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
    var sample2 = data.samples;
    console.log(sample2);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleresultArray = sample2.filter(sampleObj => sampleObj.id == sample);
    console.log(sampleresultArray);

    //  5. Create a variable that holds the first sample in the array.
    var firstsampleresult = sampleresultArray[0];
    console.log(firstsampleresult);


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstsampleresult.otu_ids;
    console.log(otu_ids);
    var otu_labels = firstsampleresult.otu_labels;
    console.log(otu_labels);
    var sample_values = firstsampleresult.sample_values;
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map(sampleObj => " OTU " + sampleObj).slice(0,10)

    yticks = yticks.reverse();
    console.log(yticks);

    // sample_values = sample_values.slice(0,10).reverse();
    // console.log(sample_values);

    // 8. Create the trace for the bar chart. 
    var barData = [{      
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      marker:{
        color: '#E67E22'
      },
      text: otu_labels.reverse()
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {
        text: "<b>Top 10 Bacteria Cultures Found</b>",
        font: {color:'#4A235A '}
      },       
      plot_bgcolor:'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)'   
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    
    // Bubble chart
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker:{
        size: sample_values,
        color: otu_ids,
        //colorscale: 'Earth'
        colorscale:'Picnic'
      },
      
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text: "<b>Bacteria Cultures Per Sample</b>",
        font: {color: '#4A235A '}
      },
      xaxis: {title: "OTU ID"},
      hovermode: 'closest',
      plot_bgcolor:'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData,bubbleLayout); 


    //Gauge Chart
    // Create a variable that holds the samples array. 
    // Already did:
    // sample2

    // Create a variable that filters the samples for the object with the desired sample number.
    // Already did:
    // sampleresultArray

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugemetadata = data.metadata.filter(d=>d.id == sample);
    console.log(gaugemetadata);

    // Create a variable that holds the first sample in the array.
    // Already did:
    // firstsampleresult
  

    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeresult = gaugemetadata[0];;
    console.log(gaugeresult)

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // Already did: 
    // otu_ids
    // otu_labels
    // sample_values


    // 3. Create a variable that holds the washing frequency.
    var gaugewfreq = gaugeresult.wfreq;
    console.log(gaugewfreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: gaugewfreq,
      title: {
        text: "<b>Belly Button Washing Frequency</b>" + "<br>Scrubs per Week</br>",
        font: {color:'#4A235A'}
      },
      type:'indicator',
      mode:'gauge+number',
      gauge:{
        axis: {range:[null,10]},
        bar: {color: '#2E4053'},
        steps: [
          {range: [0,2], color:"LightCyan"},
          {range: [2,4], color: "LightBlue"},
          {range: [4,6], color: "SkyBlue"},
          {range: [6,8], color: "DeepSkyBlue"},
          {range: [8,10], color: "SteelBlue"},
        ]

      }
  

    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width:600,
      height:500,
      margin:{
        t:0,
        b:0
      },
      plot_bgcolor:'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)'
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  }); 

}
