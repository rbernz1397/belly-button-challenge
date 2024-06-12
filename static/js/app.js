// testing console
console.log('hey everyone')

//Define url variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

//Fetch the JSON data and console log it
let data = d3.json(url).then(function(data) {
  console.log(data);
});


// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sampleArray = metadata.filter(obj => obj.id == sample);
    let selectedSample = sampleArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (key in selectedSample) {
      panel.append("h6").text(key.toUpperCase()+": "+selectedSample[key])
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleArray = samples.filter(obj => obj.id == sample);
    let selectedSample = sampleArray[0]

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = selectedSample.otu_ids
    let otu_labels = selectedSample.otu_labels
    let sample_values = selectedSample.sample_values

    // Build a Bubble Chart
    let trace1 = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    // Render the Bubble Chart
    let layout = {
      xaxis: {title:"OTU ID"}
    };
    Plotly.newPlot("bubble", trace1, layout)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = [{
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otu_id => "OTU "+otu_id).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // Render the Bar Chart
    let layout2 = {};
    Plotly.newPlot("bar", trace2, layout2)

  });
}

// Function to run on page load
function init() {
  d3.json(url).then((data) => {

    // Get the names field
    let sampleNames = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((name) => {
      // checking in console
      console.log(name)

      dropdownMenu.append('option').text(name).property('value', name);
    })

    // Get the first sample from the list
    let firstSample = sampleNames[0]

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });


}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
