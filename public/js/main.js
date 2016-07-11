/**
 * Created by thomasandersen on 20.06.2016.
 */
$(document).ready(function(){
    var map;
    var devicechart;
    var innsidaVisitorChart;
    var temaVisitorChart;
    var wikiVisitorChart;
    init();

    updateInnsidaWeekChart();
    updateTemaWeekChart();
    updateWikiWeekChart();


});

function init(){
    makeMap();
    makeDeviceChart();
    setInterval(getClock, 1000);
    config = {
        apiKey: "AIzaSyDGxsSprXYHfxsUwvJa74-g3T_JmJmt5kU",
        authDomain: "dashbordntnu.firebaseapp.com",
        databaseURL: "https://dashbordntnu.firebaseio.com",
        storageBucket: "dashbordntnu.appspot.com"
    };
    firebase.initializeApp(config);
    firebase.database().ref('/').on("value", function (snap) {
        // snap.val() will contain the JS object.
        jsonFromDB = snap.val();
        updateEverything(jsonFromDB);
    });
}


function updateEverything(data) {
    updateVisitors(data.ew.vistitors.visitorCount);
    updateBrowserTable(data.ew.vistitors.browsers);
    updatePopularPages(data.ew.vistitors.popularPages);
    updateMapData(data.ew.vistitors.heatmap);
    updateDeviceChart(data.ew.vistitors.platform);
    updateStudyPage(data.study);
    //updateInnsidaWikiTema(data)
}

//visitor chart data on innsida not working with firebase. Some error in console...
function updateInnsidaWikiTema(data) {
    var innsida = data.innsida;
    //innsida
    // broken URL
    document.getElementById("innsidaBrokenLinks").innerHTML = innsida.brokenUrls.number;
    document.getElementById("innsidaURLArrow").className = "ion-arrow-graph-" + innsida.brokenUrls.change + "-right bigArrow reverse";
    document.getElementById("innsidaBrokenURLpercent").innerHTML = innsida.brokenUrls.percent;

    //popular pages and search words
    document.getElementById("innsidaPopularPage-one").innerHTML = innsida.popular.pages.one;
    document.getElementById("innsidaPopularPage-two").innerHTML = innsida.popular.pages.two;
    document.getElementById("innsidaPopularPage-three").innerHTML = innsida.popular.pages.three;

    document.getElementById("innsidaPopularSearch-one").innerHTML = innsida.popular.searches.one;
    document.getElementById("innsidaPopularSearch-two").innerHTML = innsida.popular.searches.two;
    document.getElementById("innsidaPopularSearch-three").innerHTML = innsida.popular.searches.three;
    var days = innsida.visitors;
    innsidaVisitorChart.dataProvider =
        [
            days.monday,
            days.thuesday,
            days.wednesday,
            days.thursday,
            days.friday,
            days.saturday,
            days.sunday
        ];
    //innsidaVisitorChart.ignoreZoomed = true;
    innsidaVisitorChart.startDate = days.monday.date;
    innsidaVisitorChart.endDate = days.sunday.date;
    innsidaVisitorChart.zoomToDates(innsidaVisitorChart.startDate, innsidaVisitorChart.endDate);
    innsidaVisitorChart.validateData();
}

function updateInnsidaWeekChart() {
    var chartData = [
        {
            "date": "2016-07-11",
            "thisWeek": 0,
            "lastWeek": 0

        },
        {
            "date": "2016-07-12",
            "thisWeek": 0,
            "lastWeek": 0

        },
        {
            "date": "2016-07-13",
            "thisWeek": 0,
            "lastWeek": 0

        },
        {
            "date": "2016-07-14",
            "thisWeek": 0,
            "lastWeek": 0

        },
        {
            "date": "2016-07-15",
            "thisWeek": 0,
            "lastWeek": 0

        },
        {
            "date": "2016-07-16",
            "thisWeek": 0,
            "lastWeek": 0

        },
        {
            "date": "2016-07-17",
            "thisWeek": 0,
            "lastWeek": 0
        }

    ];

    AmCharts.ready(function () {
        // SERIAL CHART
        innsidaVisitorChart = new AmCharts.AmSerialChart();
        innsidaVisitorChart.dataProvider = chartData;
        innsidaVisitorChart.categoryField = "date";
        innsidaVisitorChart.dataDateFormat = "YYYY-MM-DD";
        innsidaVisitorChart.color = "#FFFFFF";
        innsidaVisitorChart.marginLeft = 0;

        // AXES
        // category
        var categoryAxis = innsidaVisitorChart.categoryAxis;
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
        innsidaVisitorChart.addValueAxis(thisWeekAxis);

        // lastWeek value axis
        var lastWeekAxis = new AmCharts.ValueAxis();
        lastWeekAxis.gridAlpha = 0;
        lastWeekAxis.axisAlpha = 0;
        innsidaVisitorChart.addValueAxis(lastWeekAxis);

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
        innsidaVisitorChart.addGraph(thisWeekGraph);

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
        innsidaVisitorChart.addGraph(lastWeekGraph);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.zoomable = false;
        chartCursor.categoryBalloonDateFormat = "EEE";
        chartCursor.cursorAlpha = 0;
        chartCursor.valueBalloonsEnabled = false;
        innsidaVisitorChart.addChartCursor(chartCursor);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.bulletType = "round";
        legend.equalWidths = false;
        legend.valueWidth = 100;
        legend.useGraphSettings = true;
        legend.color = "#FFFFFF";
        innsidaVisitorChart.addLegend(legend);
        innsidaVisitorChart.creditsPosition = "top-right";

        // WRITE
        innsidaVisitorChart.write("innsidaWeekChart");
    });

}

function updateStudyPage(data) {
    document.getElementById("study-most-visit-one").innerHTML = data.mostVisited.one;
    document.getElementById("study-most-visit-two").innerHTML = data.mostVisited.two;
    document.getElementById("study-most-visit-three").innerHTML = data.mostVisited.three;
    document.getElementById("study-most-visit-four").innerHTML = data.mostVisited.four;
    document.getElementById("study-most-visit-five").innerHTML = data.mostVisited.five;

    document.getElementById("study-least-visit-one").innerHTML = data.leastVisited.one;
    document.getElementById("study-least-visit-two").innerHTML = data.leastVisited.two;
    document.getElementById("study-least-visit-three").innerHTML = data.leastVisited.three;
    document.getElementById("study-least-visit-four").innerHTML = data.leastVisited.four;
    document.getElementById("study-least-visit-five").innerHTML = data.leastVisited.five;

    document.getElementById("study-increasing-one").innerHTML = data.increasing.one;
    document.getElementById("study-increasing-two").innerHTML = data.increasing.two;
    document.getElementById("study-increasing-three").innerHTML = data.increasing.three;
    document.getElementById("study-increasing-four").innerHTML = data.increasing.four;
    document.getElementById("study-increasing-five").innerHTML = data.increasing.five;

    document.getElementById("study-decreasing-one").innerHTML = data.decreasing.one;
    document.getElementById("study-decreasing-two").innerHTML = data.decreasing.two;
    document.getElementById("study-decreasing-three").innerHTML = data.decreasing.three;
    document.getElementById("study-decreasing-four").innerHTML = data.decreasing.four;
    document.getElementById("study-decreasing-five").innerHTML = data.decreasing.five;

}

function updateDeviceChart(data) {
    devicechart.dataProvider = [data.computer,data.smartphone,data.tablet];
    devicechart.validateData();
}

function updateMapData(data) {
    // generate bew values
    map.dataProvider.areas = [
     data.Akershus,
     data.AustAgder,
     data.Buskerud,
     data.Finnmark,
     data.Hedmark,
     data.Hordaland,
     data.MoreOgRomsdal,
     data.NordTrondelag,
     data.Nordland,
     data.Oppland,
     data.Oslo,
     data.Ostfold,
     data.Rogaland,
     data.SognOgFjordane,
     data.SorTrondelag,
     data.Telemark,
     data.Troms,
     data.VestAgder,
     data.Vestfold
     ];
    //TODO: map loses hover after update

    // update map
    map.validateNow();
}





function updatePopularPages(data) {
    document.getElementById("mostPopular-one").innerHTML = data.mostPopular.one;
    document.getElementById("mostPopular-two").innerHTML = data.mostPopular.two;
    document.getElementById("mostPopular-three").innerHTML = data.mostPopular.three;
    document.getElementById("mostPopular-four").innerHTML = data.mostPopular.four;
    document.getElementById("mostPopular-five").innerHTML = data.mostPopular.five;

    document.getElementById("leastPopular-one").innerHTML = data.leastPopular.one;
    document.getElementById("leastPopular-two").innerHTML = data.leastPopular.two;
    document.getElementById("leastPopular-three").innerHTML = data.leastPopular.three;
    document.getElementById("leastPopular-four").innerHTML = data.leastPopular.four;
    document.getElementById("leastPopular-five").innerHTML = data.leastPopular.five;
}

function updateVisitors(data) {
    document.getElementById("currentVisitors").innerHTML = data.current;
    var week = data.lastWeek;
    updateIntervalPercentArrows(week.change, "Week");
    var month = data.lastMonth;
    updateIntervalPercentArrows(month.change, "Month");
    var year = data.lastYear;
    updateIntervalPercentArrows(year.change, "Year");

    document.getElementById("changeWeek").innerHTML = week.percent;
    document.getElementById("weekPercent").innerHTML = "%";
    document.getElementById("changeMonth").innerHTML = month.percent;
    document.getElementById("monthPercent").innerHTML = "%";
    document.getElementById("changeYear").innerHTML = year.percent;
    document.getElementById("yearPercent").innerHTML = "%";
}

function updateIntervalPercentArrows(value, name) {
    var id = name.toLowerCase() + "Arrow";
    document.getElementById(id).className = "ion-arrow-graph-" + value + "-right";

}



function updateBrowserTable(data) {

    var firefox = data.Firefox;
    var chrome = data.Chrome;
    var ie = data.IE;
    var safari = data.Safari;
    var opera = data.Opera;
    var array = [firefox, chrome, ie, safari, opera];
    var sorted = array.sort(function(a, b) {return parseInt(a.numbers) - parseInt(b.numbers);});
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

    AmCharts.ready(function () {
        // SERIAL CHART
        temaVisitorChart = new AmCharts.AmSerialChart();
        temaVisitorChart.dataProvider = chartData;
        temaVisitorChart.categoryField = "date";
        temaVisitorChart.dataDateFormat = "YYYY-MM-DD";
        temaVisitorChart.color = "#FFFFFF";
        temaVisitorChart.marginLeft = 0;

        // AXES
        // category
        var categoryAxis = temaVisitorChart.categoryAxis;
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
        temaVisitorChart.addValueAxis(thisWeekAxis);

        // lastWeek value axis
        var lastWeekAxis = new AmCharts.ValueAxis();
        lastWeekAxis.gridAlpha = 0;
        lastWeekAxis.axisAlpha = 0;
        temaVisitorChart.addValueAxis(lastWeekAxis);

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
        temaVisitorChart.addGraph(thisWeekGraph);

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
        temaVisitorChart.addGraph(lastWeekGraph);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.zoomable = false;
        chartCursor.categoryBalloonDateFormat = "EEE";
        chartCursor.cursorAlpha = 0;
        chartCursor.valueBalloonsEnabled = false;
        temaVisitorChart.addChartCursor(chartCursor);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.bulletType = "round";
        legend.equalWidths = false;
        legend.valueWidth = 100;
        legend.useGraphSettings = true;
        legend.color = "#FFFFFF";
        temaVisitorChart.addLegend(legend);
        temaVisitorChart.creditsPosition = "top-right";

        // WRITE
        temaVisitorChart.write("temaWeekChart");
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

    AmCharts.ready(function () {
        // SERIAL CHART
        wikiVisitorChart = new AmCharts.AmSerialChart();
        wikiVisitorChart.dataProvider = chartData;
        wikiVisitorChart.categoryField = "date";
        wikiVisitorChart.dataDateFormat = "YYYY-MM-DD";
        wikiVisitorChart.color = "#FFFFFF";
        wikiVisitorChart.marginLeft = 0;

        // AXES
        // category
        var categoryAxis = wikiVisitorChart.categoryAxis;
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
        wikiVisitorChart.addValueAxis(thisWeekAxis);

        // lastWeek value axis
        var lastWeekAxis = new AmCharts.ValueAxis();
        lastWeekAxis.gridAlpha = 0;
        lastWeekAxis.axisAlpha = 0;
        wikiVisitorChart.addValueAxis(lastWeekAxis);

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
        wikiVisitorChart.addGraph(thisWeekGraph);

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
        wikiVisitorChart.addGraph(lastWeekGraph);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.zoomable = false;
        chartCursor.categoryBalloonDateFormat = "EEE";
        chartCursor.cursorAlpha = 0;
        chartCursor.valueBalloonsEnabled = false;
        wikiVisitorChart.addChartCursor(chartCursor);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.bulletType = "round";
        legend.equalWidths = false;
        legend.valueWidth = 100;
        legend.useGraphSettings = true;
        legend.color = "#FFFFFF";
        wikiVisitorChart.addLegend(legend);
        wikiVisitorChart.creditsPosition = "top-right";

        // WRITE
        wikiVisitorChart.write("wikiWeekChart");
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
    context.font = "25px Sans-serif";
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

//DeviceChart
function makeDeviceChart() {
    var chartData = [
        {
            "color": "#03A9FC",
            "device": "Computer",
            "visits": 0

        },
        {
            "color": "#87CE37",
            "device": "Smartphone",
            "visits": 0

        },
        {
            "color": "#F05576",
            "device": "Tablet",
            "visits": 0

        }
    ];

    AmCharts.ready(function () {
        // PIE CHART
        devicechart = new AmCharts.AmPieChart();
        devicechart.dataProvider = chartData;
        devicechart.titleField = "device";
        devicechart.valueField = "visits";
        devicechart.colorField = "color";
        devicechart.sequencedAnimation = true;
        devicechart.startEffect = "elastic";
        devicechart.innerRadius = "60%";
        devicechart.radius = "40%";
        devicechart.labelRadius = 15;
        devicechart.color = "white";
        devicechart.balloonText = "[[title]]<br><span style='font-size:14px;'><b>[[value]]</b> ([[percents]]%)</span>";
        devicechart.autoMargins = false;
        devicechart.marginTop = 0;
        devicechart.marginBottom = 0;
        devicechart.marginLeft = 0;
        devicechart.marginRight = 0;
        devicechart.pullOutRadius = 0;
        devicechart.creditsPosition = "bottom-left";

        // WRITE
        devicechart.write("devicediv");
    });
}

//norway HeatMap
function makeMap() {

    AmCharts.ready(function() {
        map = new AmCharts.AmMap();

        /*NOTE: There is no id NO-13!!!*/
        map.colorSteps = 10;

        var dataProvider = {
            mapVar: AmCharts.maps.norwayLow,

            areas: [
                {
                    id: "NO-02",
                    value: 0},
                {
                    id: "NO-01",
                    value: 0},
                {
                    id: "NO-03",
                    value: 0},
                {
                    id: "NO-04",
                    value: 0},
                {
                    id: "NO-05",
                    value: 0},
                {
                    id: "NO-06",
                    value: 0},
                {
                    id: "NO-07",
                    value: 0},
                {
                    id: "NO-08",
                    value: 0},
                {
                    id: "NO-09",
                    value: 0},
                {
                    id: "NO-10",
                    value: 0},
                {
                    id: "NO-11",
                    value: 0},
                {
                    id: "NO-12",
                    value: 0},
                {
                    id: "NO-14",
                    value: 0},
                {
                    id: "NO-15",
                    value: 0},
                {
                    id: "NO-16",
                    value: 0},
                {
                    id: "NO-17",
                    value: 0},
                {
                    id: "NO-18",
                    value: 0},
                {
                    id: "NO-19",
                    value: 0},
                {
                    id: "NO-20",
                    value: 0}]
        };


        map.areasSettings = {
            alpha: 0.8,
            //color: "#F95372",
            color: "#00abff",
            colorSolid: "#8BD22F",
            unlistedAreasAlpha: 0.4,
            unlistedAreasColor: "#000000",
            outlineColor: "#FFFFFF",
            outlineAlpha: 0.5,
            outlineThickness: 1,
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