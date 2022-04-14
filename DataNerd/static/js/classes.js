am5.ready(function() {

    // Get Data from API
    d3.json("/api/classes").then(data => {
        console.log("raw data",data);

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("radardiv");
        
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
        am5themes_Animated.new(root)
        ]);
        
        // Generate and set data
        // https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
        var cat = -1;
        var value = 10;

        // create array of classes
        var filterOptions = []
        data.forEach(d => {
          if(filterOptions.indexOf(d.Class) === -1) {
              filterOptions.push(d.Class)
          }  
        })
        console.log(filterOptions)
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

        var defaultData = data.filter(d => {
            return d.Class === "Warrior";
        })
        console.log("defaultData",defaultData)
        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/radar-chart/
        var chart = root.container.children.push(am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX"
        }));
        
        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
        var cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
        behavior: "zoomX"
        }));
        
        cursor.lineY.set("visible", false);
        
        // Create axes and their renderers
        // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
        var xRenderer = am5radar.AxisRendererCircular.new(root, {});
        xRenderer.labels.template.setAll({
        radius: 10
        });
        
        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "stat",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
        }));
        
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            //min: 0,
            //max: 20,
        renderer: am5radar.AxisRendererRadial.new(root, {})
        }));

        // Create series
        // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
        // var stats = ['ARC','DEX','END','FTH','INT','MND','STR','VIG']
        //var statsv = [ARC,DEX,END,FTH,INT,MND,STR,VIG]
        
        var generateData = (data) => {
            classStats = []
            Object.keys(data[0]).forEach(key => {
                classStats.push({
                    stat: key,
                    value: data[0][key]
                })
            })
            console.log(classStats)
            return classStats
        }

        //testing generateData function
        generateData(defaultData)

        //for (var i = 0; i < stats.length; i++) {
            var series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
                name: "Series ",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                categoryXField: "stat"
            }));
        //}
        series.columns.template.setAll({
            tooltipText: "{name}: {valueY}"
        });

        // Make each column to be of a different color
        series.columns.template.adapters.add("fill", function (fill, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });
        
        series.columns.template.adapters.add("stroke", function (stroke, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });
        
        var classData = generateData(defaultData);
        series.data.setAll(classData);
        
        series.appear(1000);
        
        
        // Add scrollbars
        //chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
        //chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical" }));
        
        //var data = generateDatas(8);
        xAxis.data.setAll(classData);
        
        // Animate chart
        // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
        chart.appear(1000, 100);
        var setData = (filterSelect,data) => {
            var filteredData = data.filter(d => {
                return d.Class === filterSelect;
            })
            var classData = generateData(filteredData);
        series.data.setAll(classData);
        }
    }); // end d3.json()   
}); // end am5.ready()