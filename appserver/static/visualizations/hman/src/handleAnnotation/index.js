const _handleAnnotation = function (data, echartProps, option, dedicatedEchart) {
  // first index points to x, second to y and third to the index of the annotation
  let annotationSeriesDataIndexBinding = echartProps.annotationSeriesDataIndexBinding;
  let annotationSeriesDataIndex = this._parseIndex(annotationSeriesDataIndexBinding);;
  dedicatedEchart['_annotationSeriesDataIndex'] = annotationSeriesDataIndex;

  if (annotationSeriesDataIndex.length != 3) {
    let error = "Please provide the configuration annotationSeriesDataIndexBinding. It has to be 3 numbers separated by a comma.\n"
    error += "1. Index of the column providing the x-value of the annotated series.\n"
    error += "2. Index of the column providing the y-value of the annotated series.\n"
    error += "3. Index of the column providing the annotation value.\n"
    error += "Example: 0,1,2\n"
    error += "0 indicates that the first column is used as the x-value of the annotation.\n"
    error += "1 indicates that the second column is used as the y-value of the annotation.\n"
    error += "2 indicates that the third column providing the value.\n"

    throw error
  }
  dedicatedEchart["annotationSeriesNameContainer"] = echartProps.annotationSeriesName;
  dedicatedEchart["annotationSeriesName"] = echartProps.annotationSeriesName;
  dedicatedEchart["opcoContainer"] = echartProps.opco;
  dedicatedEchart["opco"] = echartProps.opco;

  dedicatedEchart['instanceByDom'].on('click', (function (option) {
    return function (params) {
      var annotationSeriesName = echartProps.annotationSeriesName;
      if (annotationSeriesName != null) {
        var xValue;
        var xAxisValue;
        var yValue = params.value;
        if (params.seriesName === annotationSeriesName) {

          if (option === null || option.xAxis === null || !Array.isArray(option.xAxis) ||
            option.xAxis.length == 0 || option.xAxis[0].type === null) {
            throw new Error("xAxis.type missing in option");
          }
          // according to the echart documentation the x value has to be read from different
          // attributes of the params depending on the type of the x Axis
          if (option.xAxis[0].type === "time") {
            // x Axis of type time is an expeptional case. We get unix time in the search
            // but splunk converts it to a readable format based on the local time of the user
            // We would run into problems if the local time would be used as part of the key in 
            // the database. The solution is to store the unix time instead of the local time.
            // This is the reason why the user has to provide the unix time in the dimension "value"
            // of the x axis data.
            if (Array.isArray(params.dimensionNames) && params.dimensionNames.length > 0) {
              for (let i = 0; i < params.dimensionNames.length; i++) {
                if ("x" === params.dimensionNames[i]) {
                  xAxisValue = params.value[i];
                } else if ("value" === params.dimensionNames[i]) {
                  xValue = params.value[i];
                }
              }
            }
          } else if (option.xAxis[0].type === "category") {
            xValue = params.name;
            xAxisValue = xValue;

          } else if (option.xAxis[0].type === "value") {
            if (Array.isArray(params.dimensionNames) && params.dimensionNames.length > 0) {
              for (let i = 0; i < params.dimensionNames.length; i++) {
                if ("x" === params.dimensionNames[i]) {
                  xValue = params.value[i];
                  xAxisValue = xValue;
                }
              }
            }
          }

          if (Array.isArray(params.dimensionNames) && params.dimensionNames.length > 0) {
            for (let i = 0; i < params.dimensionNames.length; i++) {
              if ("y" === params.dimensionNames[i]) {
                yValue = params.value[i];
              }
            }
          }

          // store hidden values in the DOM tree
          dedicatedEchart["xValue"] = xValue;
          dedicatedEchart["xAxisValue"] = xAxisValue;
          dedicatedEchart["yValue"] = yValue;

          var descriptionInput = document.getElementById("descriptionInput");
          descriptionInput.focus();
          descriptionInput.select();
          for (let i = 0; i < dedicatedEchart['_option'].series[dedicatedEchart['_annotationSeriesIndex']].data.length; i++) {
            var obj = dedicatedEchart['_option'].series[dedicatedEchart['_annotationSeriesIndex']].data[i];
            var x = obj[0];
            if (xAxisValue == x) {
              var description = obj[2];
              descriptionInput.value = description;
              dedicatedEchart['descriptionInput'] = description
            }

          }

          $("#xValueContainer").text("X Value: " + xAxisValue); // Update X value in the modal_annotation
          $("#yValueContainer").text("Y Value: " + yValue); // Update Y value in the modal_annotation
          $('#saveButton').attr('target_echart_id', dedicatedEchart.id);
          var modal_annotationElement = document.getElementById("myModal_annotation")
          modal_annotationElement.style.display = "block";
        }
      }
    }
  }).call(this, option));

  if (annotationSeriesDataIndexBinding == null) {
    var error = "Missing configuration. Please provide a config named 'annotationSeriesDataIndexBinding' with the index of the column that contains the annotation data.";
    throw error;
  } else {
    var annotationSeries = {
      type: 'scatter',
      symbol: 'pin',
      symbolSize: 15,
      data: [],
      itemStyle: {
        color: '#ff6600', // Set the color of the annotation symbols
        opacity: 1, // Adjust the opacity of the annotation symbols
        borderColor: '#000', // Set the border color of the annotation symbols
        borderWidth: 1 // Set the border width of the annotation symbols
      },
      label: {
        show: true, // Display the annotation text
        formatter: function (param) {
          return param.value[2]; // Show the annotation text
        },
        position: 'top' // Position the annotation text above the symbols
      }
    };
    annotationSeries["data"] = [];
    annotationSeries["name"] = echartProps.annotationSeriesName + " annotation";
    for (let i = 0; i < data.rows.length; i++) {
      var annotationValue = data.rows[i][annotationSeriesDataIndex[2]];
      if (annotationValue != null && "" != annotationValue && "'-'" != annotationValue) {
        var annotationData = [];
        annotationData.push(data.rows[i][annotationSeriesDataIndex[0]]);
        annotationData.push(data.rows[i][annotationSeriesDataIndex[1]]);
        annotationData.push(data.rows[i][annotationSeriesDataIndex[2]]);
        annotationSeries.data.push(annotationData);
      }
    }
    dedicatedEchart['_annotationSeriesIndex'] = option.series.length;
    option.series.push(annotationSeries);
  }

}

module.exports = _handleAnnotation;