/**
 * Created by thomasandersen on 20.06.2016.
 */
$(document).ready(function(){
    setInterval(getClock, 1000);
    makeMap();
    makeDeviceChart();
    //updateIntervalPercent();
    //updateCurrentVisitors();
    updateMostPopularPages();

    //Test of changing arrows according to recived values
    //updateIntervalPercentArrows(-8,"Week");
    //updateIntervalPercentArrows(2,"Month");
    //updateIntervalPercentArrows(-8,"Year");
    updateInnsidaWeekChart();
    updateTemaWeekChart();
    updateWikiWeekChart();

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDGxsSprXYHfxsUwvJa74-g3T_JmJmt5kU",
        authDomain: "dashbordntnu.firebaseapp.com",
        databaseURL: "https://dashbordntnu.firebaseio.com",
        storageBucket: "dashbordntnu.appspot.com"
    };
    firebase.initializeApp(config);
    firebase.database().ref('/ew/vistitors/browsers').on("value", function (snap) {
        // snap.val() will contain the JS object.
        jsonFromDB = (snap.val());
        //console.log("DATA:")
        //console.log(jsonFromDB)
        //$('#browserInfo').text("DATA: " + JSON.stringify(jsonFromDB));
        updateEverything(jsonFromDB);

    });
});

function updateEverything(data) {
    updateBrowserTable(data);
    updateInnsidaVersus();

}


function updateBrowserTable(data) {

    var firefox = data.Firefox;
    var chrome = data.Chrome;
    var ie = data.IE;
    var safari = data.Safari;
    var opera = data.Opera;
    var array = [firefox, chrome, ie, safari, opera];
    var sorted = array.sort(function(a, b) {
        return parseInt(a.numbers) - parseInt(b.numbers);
    });
    var logoStartString = '<img src="img/';
    var logoEndString = '.svg" height="20" width="20">';
    
    document.getElementById("browserLogoOne").innerHTML = logoStartString + sorted[4].name.toLowerCase() + logoEndString;
    document.getElementById("browserLogoTwo").innerHTML = logoStartString + sorted[3].name.toLowerCase() + logoEndString;
    document.getElementById("browserLogoThree").innerHTML = logoStartString + sorted[2].name.toLowerCase() + logoEndString;
    document.getElementById("browserLogoFour").innerHTML = logoStartString + sorted[1].name.toLowerCase() + logoEndString;
    document.getElementById("browserLogoFive").innerHTML = logoStartString + sorted[0].name.toLowerCase() + logoEndString;

    document.getElementById("browserNameOne").innerHTML = sorted[4].name;
    document.getElementById("browserNameTwo").innerHTML = sorted[3].name;
    document.getElementById("browserNameThree").innerHTML = sorted[2].name;
    document.getElementById("browserNameFour").innerHTML = sorted[1].name;
    document.getElementById("browserNameFive").innerHTML = sorted[0].name;

    document.getElementById("browserNumOne").innerHTML = sorted[4].numbers;
    document.getElementById("browserNumTwo").innerHTML = sorted[3].numbers;
    document.getElementById("browserNumThree").innerHTML = sorted[2].numbers;
    document.getElementById("browserNumFour").innerHTML = sorted[1].numbers;
    document.getElementById("browserNumFive").innerHTML = sorted[0].numbers;

    document.getElementById("browserPercentOne").innerHTML = sorted[4].percent + "%";
    document.getElementById("browserPercentTwo").innerHTML = sorted[3].percent + "%";
    document.getElementById("browserPercentThree").innerHTML = sorted[2].percent + "%";
    document.getElementById("browserPercentFour").innerHTML = sorted[1].percent + "%";
    document.getElementById("browserPercentFive").innerHTML = sorted[0].percent + "%";
}

/*
function calculatePercent(part, total) {
    return (part/total*100).toFixed(1);
}
*/

function updateMostPopularPages(){
    $.ajax({
        url:"http://139.59.168.70/ew/visitors/browsers",
        async:true,
        dataType: 'json',
        type:'get'
    }).done(function(data) {

        /*Change class of arrows depending on if the values have increased/decreased*/

    });
}

function updateLeastPopularPages(){

}

function updateIntervalPercent() {
    $.ajax({
     url:"http://139.59.168.70/ew/visitors/change",
     async:true,
     dataType: 'json',
     type:'get'
     }).success(function(data) {
        /*Change class of arrows depending on if the values have increased/decreased*/
        var month = data[0].value;
        updateIntervalPercentArrows(month, "Month");
        var year = data[1].value;
        updateIntervalPercentArrows(year, "Year");
        var week = data[2].value;
        updateIntervalPercentArrows(week, "Week");

        document.getElementById("changeMonth").innerHTML = month;
        document.getElementById("changeYear").innerHTML = year;
        document.getElementById("changeWeek").innerHTML = week;

    });
}

function updateIntervalPercentArrows(value, name) {
    /*This method should not set arrows according to positive/negative values but historic values.*/
    var id = "change" + name + "-arrow";
    if (value >= 0) {
        document.getElementById(id).className = "ion-arrow-graph-up-right";
    }
    else {
        document.getElementById(id).className = "ion-arrow-graph-down-right";
    }

}

function updateCurrentVisitors() {

    var data = [
        {"id":"currentVisitors", "value":1236}
    ]

    document.getElementById("currentVisitors").innerHTML = data[0].value;
}


function updatePlatform() {
    $.ajax({
        url:"http://139.59.168.70/ew/visitors/platform",
        async:true,
        dataType: 'json',
        type:'get'
    }).done(function(data) {

    });
}


function makeMap() {
    var map;

    AmCharts.ready(function() {
        map = new AmCharts.AmMap();

        /*NOTE: There is no id NO-13!!!*/
        map.colorSteps = 10;

        var dataProvider = {
            mapVar: AmCharts.maps.norwayLow,

            areas: [
                {   /*Akershus*/
                    id: "NO-02",
                    value: 1},
                {   /*Østfold*/
                    id: "NO-01",
                    value: 2},
                {   /*Oslo*/
                    id: "NO-03",
                    value: 3},
                {   /*Hedmark*/
                    id: "NO-04",
                    value: 4},
                {   /*Oppland*/
                    id: "NO-05",
                    value: 5},
                {   /*Buskerud*/
                    id: "NO-06",
                    value: 6},
                {   /*Vestfold*/
                    id: "NO-07",
                    value: 7},
                {   /*Telemark*/
                    id: "NO-08",
                    value: 8},
                {   /*Aust-Agder*/
                    id: "NO-09",
                    value: 9},
                {   /*Vest-Adger*/
                    id: "NO-10",
                    value: 10},
                {   /*Rogaland*/
                    id: "NO-11",
                    value: 11},
                {   /*Hordaland*/
                    id: "NO-12",
                    value: 12},
                {   /*Sogn og fjordane*/
                    id: "NO-14",
                    value: 13},
                {   /*Møre og Romsdal*/
                    id: "NO-15",
                    value: 14},
                {   /*Sør-Trøndelag*/
                    id: "NO-16",
                    value: 15},
                {   /*Nord-Trøndelag*/
                    id: "NO-17",
                    value: 16},
                {   /*Nordland*/
                    id: "NO-18",
                    value: 17},
                {   /*Troms*/
                    id: "NO-19",
                    value: 18},
                {   /*Finnmark*/
                    id: "NO-20",
                    value: 19}]
        };

        map.areasSettings = {
            alpha: 0.8,
            color: "#F95372",
            colorSolid: "#8BD22F",
            unlistedAreasAlpha: 0.4,
            unlistedAreasColor: "#000000",
            outlineColor: "#FFFFFF",
            outlineAlpha: 0.5,
            outlineThickness: 0.5,
            rollOverColor: "#03A9FC",
            rollOverOutlineColor: "#FFFFFF",
            selectedOutlineColor: "#FFFFFF",
            selectedColor: "#ffffff",
            unlistedAreasOutlineColor: "#FFFFFF",
            unlistedAreasOutlineAlpha: 0.5,
            autoZoom: true
        };
        map.dataProvider = dataProvider;

        var valueLegend = new AmCharts.ValueLegend();
        valueLegend.right = 10;
        valueLegend.minValue = "little";
        valueLegend.maxValue = "a lot!";
        valueLegend.color = "white";
        map.valueLegend = valueLegend;
        map.color = "white";

        map.write("mapdiv");
    });
}

function makeDeviceChart() {
    var chart;

    var chartData = [
        {
            "device": "Computer",
            "visits": 9252,
            "color": "#03A9FC"
        },
        {
            "device": "Smartphone",
            "visits": 1882,
            "color": "#87CE37"
        },
        {
            "device": "Tablet",
            "visits": 711,
            "color": "#F05576"
        }
    ];

    AmCharts.ready(function () {
        // PIE CHART
        chart = new AmCharts.AmPieChart();

        chart.dataProvider = chartData;
        chart.titleField = "device";
        chart.valueField = "visits";
        chart.colorField = "color";
        chart.sequencedAnimation = true;
        chart.startEffect = "elastic";
        chart.innerRadius = "60%";
        chart.radius = "40%";
        chart.labelRadius = 15;
        chart.color = "white";
        chart.balloonText = "[[title]]<br><span style='font-size:14px;'><b>[[value]]</b> ([[percents]]%)</span>";
        chart.autoMargins = false;
        chart.marginTop = 0;
        chart.marginBottom = 0;
        chart.marginLeft = 0;
        chart.marginRight = 0;
        chart.pullOutRadius = 0;
        chart.creditsPosition = "bottom-left";

        // WRITE
        chart.write("devicediv");
    });

}

function updateInnsidaWeekChart() {
    var chartData = [
        {
            "date": "2016-01-11",
            "thisWeek": 227,
            "lastWeek": 113

        },
        {
            "date": "2016-01-12",
            "thisWeek": 371,
            "lastWeek": 257

        },
        {
            "date": "2016-01-13",
            "thisWeek": 433,
            "lastWeek": 312

        },
        {
            "date": "2016-01-14",
            "thisWeek": 345,
            "lastWeek": 225

        },
        {
            "date": "2016-01-15",
            "thisWeek": 480,
            "lastWeek": 675

        },
        {
            "date": "2016-01-16",
            "thisWeek": 386,
            "lastWeek": 462

        },
        {
            "date": "2016-01-17",
            "thisWeek": 348,
            "lastWeek": 147
        }

    ];
    var chart;

    AmCharts.ready(function () {
        // SERIAL CHART
        chart = new AmCharts.AmSerialChart();
        chart.dataProvider = chartData;
        chart.categoryField = "date";
        chart.dataDateFormat = "YYYY-MM-DD";
        chart.color = "#FFFFFF";
        chart.marginLeft = 0;

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.autoGridCount = false;
        categoryAxis.gridCount = 50;
        categoryAxis.gridAlpha = 0.1;
        categoryAxis.gridColor = "#FFFFFF";
        categoryAxis.axisColor = "#555555";

        // as we have data of different units, we create three different value axes
        // thisWeek value axis
        var thisWeekAxis = new AmCharts.ValueAxis();
        //  thisWeekAxis.title = "Users";
        thisWeekAxis.gridAlpha = 0;
        thisWeekAxis.axisAlpha = 0;
        chart.addValueAxis(thisWeekAxis);

        // lastWeek value axis
        var lastWeekAxis = new AmCharts.ValueAxis();
        lastWeekAxis.gridAlpha = 0;
        lastWeekAxis.axisAlpha = 0;
        chart.addValueAxis(lastWeekAxis);

        // GRAPHS
        // thisWeek graph
        var thisWeekGraph = new AmCharts.AmGraph();
        thisWeekGraph.id = "v1";
        thisWeekGraph.valueField = "thisWeek";
        thisWeekGraph.title = "This week";
        thisWeekGraph.type = "column";
        thisWeekGraph.fillAlphas = 0.9;
        thisWeekGraph.valueAxis = thisWeekAxis; // indicate which axis should be used
        thisWeekGraph.balloonText = "This week: [[value]]";
        thisWeekGraph.legendValueText = "[[value]] users";
        thisWeekGraph.legendPeriodValueText = "total: [[value.sum]]";
        thisWeekGraph.lineColor = "#03A9FC";
        thisWeekGraph.dashLengthField = "dashLength";
        thisWeekGraph.alphaField = "alpha";
        chart.addGraph(thisWeekGraph);

        // lastWeek graph
        var lastWeekGraph = new AmCharts.AmGraph();
        lastWeekGraph.id = "v2";
        lastWeekGraph.valueField = "lastWeek";
        lastWeekGraph.title = "Last week";
        lastWeekGraph.type = "line";
        lastWeekGraph.synchronizeWith = "v1";
        lastWeekGraph.synchronizationMultiplier = 1;
        lastWeekGraph.lineColor = "#F95372";
        lastWeekGraph.lineThickness = 1;
        lastWeekGraph.legendValueText = "[[description]] [[value]]";
        lastWeekGraph.legendPeriodValueText = "total: [[value.sum]]";
        lastWeekGraph.bullet = "round";
        lastWeekGraph.bulletBorderColor = "#F95372";
        lastWeekGraph.bulletBorderAlpha = 1;
        lastWeekGraph.bulletBorderThickness = 2;
        lastWeekGraph.balloonText = "Last week:[[value]]";
        lastWeekGraph.showBalloon = true;
        lastWeekGraph.dashLengthField = "dashLength";
        chart.addGraph(lastWeekGraph);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.zoomable = false;
        chartCursor.categoryBalloonDateFormat = "EEE";
        chartCursor.cursorAlpha = 0;
        chartCursor.valueBalloonsEnabled = false;
        chart.addChartCursor(chartCursor);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.bulletType = "round";
        legend.equalWidths = false;
        legend.valueWidth = 100;
        legend.useGraphSettings = true;
        legend.color = "#FFFFFF";
        chart.addLegend(legend);
        chart.creditsPosition = "top-right";

        // WRITE
        chart.write("innsidaWeekChart");
    });
}

function updateTemaWeekChart() {
    var chartData = [
        {
            "date": "2016-01-11",
            "thisWeek": 325,
            "lastWeek": 471

        },
        {
            "date": "2016-01-12",
            "thisWeek": 189,
            "lastWeek": 234

        },
        {
            "date": "2016-01-13",
            "thisWeek": 433,
            "lastWeek": 312

        },
        {
            "date": "2016-01-14",
            "thisWeek": 782,
            "lastWeek": 678

        },
        {
            "date": "2016-01-15",
            "thisWeek": 365,
            "lastWeek": 675

        },
        {
            "date": "2016-01-16",
            "thisWeek": 286,
            "lastWeek": 453

        },
        {
            "date": "2016-01-17",
            "thisWeek": 248,
            "lastWeek": 147
        }

    ];
    var chart;

    AmCharts.ready(function () {
        // SERIAL CHART
        chart = new AmCharts.AmSerialChart();
        chart.dataProvider = chartData;
        chart.categoryField = "date";
        chart.dataDateFormat = "YYYY-MM-DD";
        chart.color = "#FFFFFF";
        chart.marginLeft = 0;

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.autoGridCount = false;
        categoryAxis.gridCount = 50;
        categoryAxis.gridAlpha = 0.1;
        categoryAxis.gridColor = "#FFFFFF";
        categoryAxis.axisColor = "#555555";

        // as we have data of different units, we create three different value axes
        // thisWeek value axis
        var thisWeekAxis = new AmCharts.ValueAxis();
        //  thisWeekAxis.title = "Users";
        thisWeekAxis.gridAlpha = 0;
        thisWeekAxis.axisAlpha = 0;
        chart.addValueAxis(thisWeekAxis);

        // lastWeek value axis
        var lastWeekAxis = new AmCharts.ValueAxis();
        lastWeekAxis.gridAlpha = 0;
        lastWeekAxis.axisAlpha = 0;
        chart.addValueAxis(lastWeekAxis);

        // GRAPHS
        // thisWeek graph
        var thisWeekGraph = new AmCharts.AmGraph();
        thisWeekGraph.id = "v1";
        thisWeekGraph.valueField = "thisWeek";
        thisWeekGraph.title = "This week";
        thisWeekGraph.type = "column";
        thisWeekGraph.fillAlphas = 0.9;
        thisWeekGraph.valueAxis = thisWeekAxis; // indicate which axis should be used
        thisWeekGraph.balloonText = "This week: [[value]]";
        thisWeekGraph.legendValueText = "[[value]] users";
        thisWeekGraph.legendPeriodValueText = "total: [[value.sum]]";
        thisWeekGraph.lineColor = "#03A9FC";
        thisWeekGraph.dashLengthField = "dashLength";
        thisWeekGraph.alphaField = "alpha";
        chart.addGraph(thisWeekGraph);

        // lastWeek graph
        var lastWeekGraph = new AmCharts.AmGraph();
        lastWeekGraph.id = "v2";
        lastWeekGraph.valueField = "lastWeek";
        lastWeekGraph.title = "Last week";
        lastWeekGraph.type = "line";
        lastWeekGraph.synchronizeWith = "v1";
        lastWeekGraph.synchronizationMultiplier = 1;
        lastWeekGraph.lineColor = "#F95372";
        lastWeekGraph.lineThickness = 1;
        lastWeekGraph.legendValueText = "[[description]] [[value]]";
        lastWeekGraph.legendPeriodValueText = "total: [[value.sum]]";
        lastWeekGraph.bullet = "round";
        lastWeekGraph.bulletBorderColor = "#F95372";
        lastWeekGraph.bulletBorderAlpha = 1;
        lastWeekGraph.bulletBorderThickness = 2;
        lastWeekGraph.balloonText = "Last week:[[value]]";
        lastWeekGraph.showBalloon = true;
        lastWeekGraph.dashLengthField = "dashLength";
        chart.addGraph(lastWeekGraph);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.zoomable = false;
        chartCursor.categoryBalloonDateFormat = "EEE";
        chartCursor.cursorAlpha = 0;
        chartCursor.valueBalloonsEnabled = false;
        chart.addChartCursor(chartCursor);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.bulletType = "round";
        legend.equalWidths = false;
        legend.valueWidth = 100;
        legend.useGraphSettings = true;
        legend.color = "#FFFFFF";
        chart.addLegend(legend);
        chart.creditsPosition = "top-right";

        // WRITE
        chart.write("temaWeekChart");
    });
}

function updateWikiWeekChart() {
    var chartData = [
        {
            "date": "2016-01-11",
            "thisWeek": 127,
            "lastWeek": 313

        },
        {
            "date": "2016-01-12",
            "thisWeek": 371,
            "lastWeek": 457

        },
        {
            "date": "2016-01-13",
            "thisWeek": 633,
            "lastWeek": 512

        },
        {
            "date": "2016-01-14",
            "thisWeek": 345,
            "lastWeek": 225

        },
        {
            "date": "2016-01-15",
            "thisWeek": 180,
            "lastWeek": 375

        },
        {
            "date": "2016-01-16",
            "thisWeek": 236,
            "lastWeek": 134

        },
        {
            "date": "2016-01-17",
            "thisWeek": 248,
            "lastWeek": 347
        }

    ];
    var chart;

    AmCharts.ready(function () {
        // SERIAL CHART
        chart = new AmCharts.AmSerialChart();
        chart.dataProvider = chartData;
        chart.categoryField = "date";
        chart.dataDateFormat = "YYYY-MM-DD";
        chart.color = "#FFFFFF";
        chart.marginLeft = 0;

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.autoGridCount = false;
        categoryAxis.gridCount = 50;
        categoryAxis.gridAlpha = 0.1;
        categoryAxis.gridColor = "#FFFFFF";
        categoryAxis.axisColor = "#555555";

        // as we have data of different units, we create three different value axes
        // thisWeek value axis
        var thisWeekAxis = new AmCharts.ValueAxis();
        //  thisWeekAxis.title = "Users";
        thisWeekAxis.gridAlpha = 0;
        thisWeekAxis.axisAlpha = 0;
        chart.addValueAxis(thisWeekAxis);

        // lastWeek value axis
        var lastWeekAxis = new AmCharts.ValueAxis();
        lastWeekAxis.gridAlpha = 0;
        lastWeekAxis.axisAlpha = 0;
        chart.addValueAxis(lastWeekAxis);

        // GRAPHS
        // thisWeek graph
        var thisWeekGraph = new AmCharts.AmGraph();
        thisWeekGraph.id = "v1";
        thisWeekGraph.valueField = "thisWeek";
        thisWeekGraph.title = "This week";
        thisWeekGraph.type = "column";
        thisWeekGraph.fillAlphas = 0.9;
        thisWeekGraph.valueAxis = thisWeekAxis; // indicate which axis should be used
        thisWeekGraph.balloonText = "This week: [[value]]";
        thisWeekGraph.legendValueText = "[[value]] users";
        thisWeekGraph.legendPeriodValueText = "total: [[value.sum]]";
        thisWeekGraph.lineColor = "#03A9FC";
        thisWeekGraph.dashLengthField = "dashLength";
        thisWeekGraph.alphaField = "alpha";
        chart.addGraph(thisWeekGraph);

        // lastWeek graph
        var lastWeekGraph = new AmCharts.AmGraph();
        lastWeekGraph.id = "v2";
        lastWeekGraph.valueField = "lastWeek";
        lastWeekGraph.title = "Last week";
        lastWeekGraph.type = "line";
        lastWeekGraph.synchronizeWith = "v1";
        lastWeekGraph.synchronizationMultiplier = 1;
        lastWeekGraph.lineColor = "#F95372";
        lastWeekGraph.lineThickness = 1;
        lastWeekGraph.legendValueText = "[[description]] [[value]]";
        lastWeekGraph.legendPeriodValueText = "total: [[value.sum]]";
        lastWeekGraph.bullet = "round";
        lastWeekGraph.bulletBorderColor = "#F95372";
        lastWeekGraph.bulletBorderAlpha = 1;
        lastWeekGraph.bulletBorderThickness = 2;
        lastWeekGraph.balloonText = "Last week:[[value]]";
        lastWeekGraph.showBalloon = true;
        lastWeekGraph.dashLengthField = "dashLength";
        chart.addGraph(lastWeekGraph);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.zoomable = false;
        chartCursor.categoryBalloonDateFormat = "EEE";
        chartCursor.cursorAlpha = 0;
        chartCursor.valueBalloonsEnabled = false;
        chart.addChartCursor(chartCursor);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.bulletType = "round";
        legend.equalWidths = false;
        legend.valueWidth = 100;
        legend.useGraphSettings = true;
        legend.color = "#FFFFFF";
        chart.addLegend(legend);
        chart.creditsPosition = "top-right";

        // WRITE
        chart.write("wikiWeekChart");
    });
}

function updateInnsidaVersus() {
    updateTrondheimVersus();
    updateGjovikVersus();
    updateAalesundVersus();
}

function updateTrondheimVersus() {
    var chart;
    var total = 1892;
    var allLabels = [
        {
            "text": "of potential users",
            "align": "center",
            "y": 115
        },
        {
            "text": "online this week",
            "align": "center",
            "y": 130
        },
        {
            "text": "29%",
            "align": "center",
            "bold":true,
            "size":16,
            "y": 95
        }
    ];
    var chartData = [
        {
            "person": "Students",
            "visits": 252,
            "color": "#03A9FC"
        },
        {
            "person": "Staff",
            "visits": 882,
            "color": "#F95372"
        }
    ];

    //Set percentage field for amount of visited people out of potential visitors
    allLabels[2].text = (((chartData[0].visits + chartData[1].visits)/total)*100).toFixed(1).toString() + "%";

    AmCharts.ready(function () {
        chart = new AmCharts.AmPieChart();
        chart.dataProvider = chartData;
        chart.allLabels = allLabels;
        chart.titleField = "person";
        chart.valueField = "visits";
        chart.colorField = "color";
        chart.sequencedAnimation = false;
        chart.innerRadius = "60%";
        chart.radius = "40%";
        chart.color = "white";
        chart.creditsPosition = "top-right";

        chart.labelsEnabled = false;
        chart.autoMargins = false;
        chart.marginTop = 0;
        chart.marginBottom = 0;
        chart.marginLeft = 0;
        chart.marginRight = 0;
        chart.pullOutRadius = 0;

        chart.write("innsidaTrondheim");
})
}

function updateAalesundVersus() {
    var chart;
    var total = 1892;
    var allLabels = [
        {
            "text": "of potential users",
            "align": "center",
            "y": 115
        },
        {
            "text": "online this week",
            "align": "center",
            "y": 130
        },
        {
            "text": "29%",
            "align": "center",
            "bold":true,
            "size":16,
            "y": 95
        }
    ];
    var chartData = [
        {
            "person": "Students",
            "visits": 512,
            "color": "#03A9FC"
        },
        {
            "person": "Staff",
            "visits": 672,
            "color": "#F95372"
        }
    ];
    //Set percentage field for amount of visited people out of potential visitors
    allLabels[2].text = (((chartData[0].visits + chartData[1].visits)/total)*100).toFixed(1).toString() + "%";

    AmCharts.ready(function () {
        chart = new AmCharts.AmPieChart();
        chart.dataProvider = chartData;
        chart.allLabels = allLabels;
        chart.titleField = "person";
        chart.valueField = "visits";
        chart.colorField = "color";
        chart.sequencedAnimation = false;
        chart.innerRadius = "60%";
        chart.radius = "40%";
        chart.color = "white";
        chart.creditsPosition = "top-right";

        chart.labelsEnabled = false;
        chart.autoMargins = false;
        chart.marginTop = 0;
        chart.marginBottom = 0;
        chart.marginLeft = 0;
        chart.marginRight = 0;
        chart.pullOutRadius = 0;

        chart.write("innsidaAalesund");
    })
}

function updateGjovikVersus() {
    var chart;
    var total = 1892;
    var allLabels = [
        {
            "text": "of potential users",
            "align": "center",
            "y": 115
        },
        {
            "text": "online this week",
            "align": "center",
            "y": 130
        },
        {
            "text": "29%",
            "align": "center",
            "bold":true,
            "size":16,
            "y": 95
        }
    ];

    var chartData = [
        {
            "person": "Students",
            "visits": 852,
            "color": "#03A9FC"
        },
        {
            "person": "Staff",
            "visits": 382,
            "color": "#F95372",
        }
    ];

    //Set percentage field for amount of visited people out of potential visitors
    allLabels[2].text = (((chartData[0].visits + chartData[1].visits)/total)*100).toFixed(1).toString() + "%";

    AmCharts.ready(function () {
        chart = new AmCharts.AmPieChart();
        chart.dataProvider = chartData;
        chart.allLabels = allLabels;
        chart.titleField = "person";
        chart.valueField = "visits";
        chart.colorField = "color";
        chart.sequencedAnimation = false;
        chart.innerRadius = "60%";
        chart.radius = "40%";
        chart.color = "white";
        chart.creditsPosition = "top-right";

        chart.labelsEnabled = false;
        chart.autoMargins = false;
        chart.marginTop = 0;
        chart.marginBottom = 0;
        chart.marginLeft = 0;
        chart.marginRight = 0;
        chart.pullOutRadius = 0;

        chart.write("innsidaGjovik");
    })
}

//CLOCK
function getClock() {
    var context;
    var d;
    var str;
    //Get Current Time
    d = new Date();
    str = prefixZero(d.getHours(), d.getMinutes(), d.getSeconds());
    //Get the Context 2D or 3D
    context = clock.getContext("2d");
    context.clearRect(0, 0, 500, 200);
    context.font = "30px Tamaho";
    context.fillStyle = "#ffffff";
    context.fillText(str,70, 34);
}

function prefixZero(hour, min, sec)
{
    var curTime;
    if(hour < 10)
        curTime = "0"+hour.toString();
    else
        curTime = hour.toString();

    if(min < 10)
        curTime += ":0"+min.toString();
    else
        curTime += ":"+min.toString();

    if(sec < 10)
        curTime += ":0"+sec.toString();
    else
        curTime += ":"+sec.toString();
    return curTime;
}

