// Samples.json is structured like this:
// Samples:{
    // names: [array of numbers],
    // metadata: {
        // id: int,
        // ethnicity: string,
        // gender: single letter,
        // age: decimal,
        // location: string,
        // bbtype: single letter,
        // wfreq: decimal,
    //},
    // samples: [{
        // id: int,
        // otu_ids: [array of ints],
        // sample_values: [array of ints],
        // otu_labels: [array of strings],
    //}],
//}

// STEP ONE:
// Use the D3 library to read in samples.json.
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.


// * Use `sample_values` as the values for the bar chart.

// * Use `otu_ids` as the labels for the bar chart.

// * Use `otu_labels` as the hovertext for the chart.

// d3.json("/samples.json").then(function(data) {
//     console.log(data);
// });


// function unpack(rows, index) {
//     return rows.map(function(row) {
//       return row[index];
//     });
//   }



//      OK REAL START NOW
// create a function to make the plots

function buildPlot(sample) {
            
    // Build a plot variable for samples.json
    var samples = `/samples/${samples}`;
    
    //set var for bar location in the DOM using d3
    var bar_loc = d3.select("#bar");

    // get the sample.json samples data to build the plot
    d3.json(samples).then(function(data) {

        // Grab values from the data json object to build the plots
        // H Bar graph first
        var values = data["sample_values"].slice(0, 10);
        var labels = data["otu_ids"].slice(0, 10);
        var hovertext = data["otu_labels"].slice(0, 10);

        // create the H Bar graph trace
        var trace = {
          type: "bar",
          x: values,
          y: labels,
          hovertext: hovertext,
          hoverlabels: "hovertext"
        };
        
        // add trace to a data variable
        var data = [trace];
    
        var layout = {
          title: "Top Ten Bacteria by Volume",
         
        };
    
        Plotly.newPlot(bar_loc, data, layout);
    
    });
    
    // Next is the Bubble Chart
    
    d3.json(samples).then((data) => {
        
        //bubble var
        var bubble = d3.select("#bubble");

        // no vars this time, just direct 
        var trace1 = {
            x: data["otu_ids"],
            y: data["sample_values"],
            hovertext: data["otu_labels"],
            hoverlabels: "hovertext",
            mode: 'markers',
            marker: {
                size: data["sample_values"],
                color: data["otu_ids"],
            }
        }

        //array the data
        var data1 = [trace1];

        //layout1
        var layout1 = {
            title: "Bubbles of Bacteria!"
        }

        // plot those bubbles of bacteria
        Plotly.newPlot(bubble, data1, layout1);

    });
   
}



// Display the sample metadata, i.e., an individual's demographic information.
// Display each key-value pair from the metadata JSON object somewhere on the page.

function buildMeta(sample) {

    // set variable path
    var meta_data = `/metadata/${data}`;

    // open samples.json to get metadata
    d3.json(meta_data).then((data) => {
        
        // assign metadata side panel variable with d3.select
        var meta_panel = d3.select("#sample-metadata");

        // clear the DOM for #sample-metadata with each change in data dropdown
        meta_panel.html("");

        // Object.entry to append key: value pairs to the metadata side panel
        Object.entries(data).forEach(([key, value]) => {
            meta_panel.append("h4").text(`${key}: ${value}`);
        });
    });

}


// create a 
function init() {

    // reference to the dropdown select element
    var dropDown = d3.select("#selDataset");
  
    // d3 to create the base default page upon inital load
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        dropDown.append("option").text(sample).property("value", sample);
      });
  
      // first sample from the list for the default plots
      var defaultSample = sampleNames[0];
      buildPlot(defaultSample);
      buildMeta(defaultSample);
    });
  }
  

  function optionChanged(newSample) {

    // Get new data each time for each sample selected in dropdown
    buildPlot(newSample);
    buildMeta(newSample);
  }
  
  // initialize!!!!!!
  init();





 