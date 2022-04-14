am5.ready(function() {
    
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv");
    
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX:true
    }));
    
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });
    
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "Weapon",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      //max: 700,
      //min: 0,
      calcateTotals: true,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    var legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
      }));
    
    let globalData;

    function makeSeries(field,fillColor) {
        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: field,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: field,
                fill: am5.color(fillColor),
                stacked: true,
                sequencedInterpolation: true,
                categoryXField: "Weapon",
                tooltip: am5.Tooltip.new(root, {
                    labelText:"{valueYField}-{valueY}"
                })
            })
        );
        console.log(series)
        series.columns.template.setAll({
            cornerRadiusTL: 5,
            cornerRadiusTR: 5,
            cornerRadiusBL: 5,
            cornerRadiusBR: 5,
        });
        //series.columns.template.adapters.add("fill", function(fill, target) {
        //return chart.get("colors").getIndex(series.columns.indexOf(target));
        //});
        
        // series.columns.template.adapters.add("stroke", function(stroke, target) {
        // return chart.get("colors").getIndex(series.columns.indexOf(target));
        // });

        xAxis.data.setAll(globalData);
        series.data.setAll(globalData);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);

        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        // var legend = chart.children.push(am5.Legend.new(root, {
        //     centerX: am5.p50,
        //     x: am5.p50
        // }));
        
        legend.data.setAll(chart.series.values);
        console.log(legend.data.length)
    }
    
    // Set data
    // read api from flask server
    d3.json("/api/weapon+summary").then(data => {

        // create array of weapon types
        var filterOptions = []
        data.forEach(d => {
          if(filterOptions.indexOf(d.Type) === -1) {
              filterOptions.push(d.Type)
          }  
        })
        filterOptions.sort()

        // set button and dropdown list variables
        var dropdownlist = d3.select("#filter-dropdown");
        var button = d3.select("#dropdownMenuButton")

        // create html and listener for when dropdown option is clicked
        filterOptions.forEach(d =>{
            dropdownlist.append("a")
                .text(d)
                .attr("class", "dropdown-item")
                .attr("href", "#")
                .on("click", () => {
                    setData(d,data);
                    button.text(d);
                });
        })
        console.log("filter options",filterOptions);
        console.log("raw data",data);

        // set default value for chart
        data.sort((a,b) => b.Phy - a.Phy)
        var defaultData = data.filter(d => {
            return d.Type === "Colossal Sword";
        })
        console.log("defaultData", defaultData)

        globalData = defaultData;

        makeSeries("Phy",0xa367dc)
        makeSeries("Mag",0x6794dc)
        makeSeries("Fir",0xdc6788)
        makeSeries("Lit",0xdc8c67)
        makeSeries("Hol",0xdcaf67)
        console.log(chart.series.length)
    });

    // create function to set the selected data filter from dropdown
    var setData = (filterSelect,data) => {
        var filteredData = data.filter(d => {
            return d.Type === filterSelect;
        })

        filteredData.sort((a,b) => b.Phy - a.Phy);
        console.log("filtered",filteredData);
        console.log("raw",data);
    
        globalData = filteredData;

        // remove existing series
        if (chart.series.length > 0) {
            chart.series.removeIndex(0)
            .dispose();
        };
        if (chart.series.length > 0) {
            chart.series.removeIndex(0)
            .dispose();
        };
        if (chart.series.length > 0) {
            chart.series.removeIndex(0)
            .dispose();
        };
        if (chart.series.length > 0) {
            chart.series.removeIndex(0)
            .dispose();
        };
        if (chart.series.length > 0) {
            chart.series.removeIndex(0)
            .dispose();
        };

        // create new series for filtered data set
        makeSeries("Phy",0xa367dc)
        makeSeries("Mag",0x6794dc)
        makeSeries("Fir",0xdc6788)
        makeSeries("Lit",0xdc8c67)
        makeSeries("Hol",0xdcaf67)
        console.log(chart.series.length)
    }
    
    
    
    
    }); // end am5.ready()