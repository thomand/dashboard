/**
 * Created by thomasandersen on 20.06.2016.
 */
$(document).ready(function(){
    //charts and map global variables.
    var map;
    var devicechart;
    var innsidaVisitorChart;
    var temaVisitorChart;
    var wikiVisitorChart;
    var TrondheimVersuschart;
    var AalesundVersuschart;
    var GjovikVersuschart;
    var worldChart;
    init();


});

//Set up charts // Init Firebase // Collect data from firebase
function init(){
    makeMap();
    makeDeviceChart();
    makeWeekCharts();
    makeInnsidaVersusCharts();
    makeWorldChart();
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
        //update every element with data from firebase (jsonFromDB)
        updateEverything(jsonFromDB);
    });
}

function loader() {
    setTimeout(showPage, 4000);
}

function showPage() {
    document.getElementById("wrapper").style.display = "none";
    document.getElementById("myCarousel").style.display = "block";
}

//update everything with data from firebase
function updateEverything(data) {
    updateVisitors(data.ew.visitors.visitorCount);
    updateBrowserTable(data.ew.visitors.browsers);
    updatePopularPages(data.ew.visitors.popularPages);
    updateMapData(data.ew.visitors.heatmap);
    updateDeviceChart(data.ew.visitors.platform);
    updateStudyPage(data.study);
    updateInnsidaWikiTema(data.innsida,"innsida", innsidaVisitorChart);
    updateInnsidaWikiTema(data.tema,"tema", temaVisitorChart);
    updateInnsidaWikiTema(data.wiki,"wiki", wikiVisitorChart);
    updateVersusCharts(data.innsida.versusChart);
    updateGemini(data.gemini);
    updateWorldChart(data.ew.visitors.worldVisits);
    updateGeminiImages(data.gemini.image);
}

//--------------------First page------------------------//

//# Visitors ntnu.no // Last week / Last Month / Last Year
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

//helper method for direction of arrows
function updateIntervalPercentArrows(value, name) {
    var id = name.toLowerCase() + "Arrow";
    document.getElementById(id).className = "ion-arrow-graph-" + value + "-right";

}

//BrowserTable
function updateBrowserTable(data) {

    var firefox = data.Firefox;
    var chrome = data.Chrome;
    var ie = data.IE;
    var safari = data.Safari;
    var opera = data.Opera;
    var edge = data.Edge;
    var array = [firefox, chrome, ie, safari, opera, edge];
    var sorted = array.sort(function(a, b) {return parseInt(a.numbers) - parseInt(b.numbers);});
    var logoStartString = '<img src="img/';
    var logoEndString = '.svg" height="20" width="20">';

    document.getElementById("browserLogoOne").innerHTML = logoStartString + sorted[5].name.toLowerCase() + logoEndString;
    document.getElementById("browserLogoTwo").innerHTML = logoStartString + sorted[4].name.toLowerCase() + logoEndString;
    document.getElementById("browserLogoThree").innerHTML = logoStartString + sorted[3].name.toLowerCase() + logoEndString;
    document.getElementById("browserLogoFour").innerHTML = logoStartString + sorted[2].name.toLowerCase() + logoEndString;
    document.getElementById("browserLogoFive").innerHTML = logoStartString + sorted[1].name.toLowerCase() + logoEndString;
    document.getElementById("browserLogoSix").innerHTML = logoStartString + sorted[0].name.toLowerCase() + logoEndString;

    document.getElementById("browserNameOne").innerHTML = sorted[5].name;
    document.getElementById("browserNameTwo").innerHTML = sorted[4].name;
    document.getElementById("browserNameThree").innerHTML = sorted[3].name;
    document.getElementById("browserNameFour").innerHTML = sorted[2].name;
    document.getElementById("browserNameFive").innerHTML = sorted[1].name;
    document.getElementById("browserNameSix").innerHTML = sorted[0].name;

    document.getElementById("browserNumOne").innerHTML = sorted[5].numbers;
    document.getElementById("browserNumTwo").innerHTML = sorted[4].numbers;
    document.getElementById("browserNumThree").innerHTML = sorted[3].numbers;
    document.getElementById("browserNumFour").innerHTML = sorted[2].numbers;
    document.getElementById("browserNumFive").innerHTML = sorted[1].numbers;
    document.getElementById("browserNumSix").innerHTML = sorted[0].numbers;

    document.getElementById("browserPercentOne").innerHTML = sorted[5].percent + "%";
    document.getElementById("browserPercentTwo").innerHTML = sorted[4].percent + "%";
    document.getElementById("browserPercentThree").innerHTML = sorted[3].percent + "%";
    document.getElementById("browserPercentFour").innerHTML = sorted[2].percent + "%";
    document.getElementById("browserPercentFive").innerHTML = sorted[1].percent + "%";
    document.getElementById("browserPercentSix").innerHTML = sorted[0].percent + "%";
}

//Generate DeviceChart (platform)
function makeDeviceChart() {
    var chartData = [
        {
            "color": "#03A9FC",
            "device": "Computer",
            "visits": 0

        },
        {
            "color": "#87CE37",
            "device": "Phone",
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
        devicechart.labelRadius = 5;
        devicechart.color = "white";
        devicechart.balloonText = "[[title]]<br><span style='font-size:2vw; font-weight: bold'><b>[[value]]</b> ([[percents]]%)</span>";
        devicechart.autoMargins = false;
        devicechart.fontSize = 18;
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

//update DeviceChart (platform)
function updateDeviceChart(data) {
    devicechart.dataProvider = [data.computer,data.smartphone,data.tablet];
    devicechart.validateData();
}

//Generate norway HeatMap (user access location)
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
            rollOverColor: "#FFFFFF",
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
        valueLegend.fontSize = 14;
        map.valueLegend = valueLegend;
        map.color = "white";
        map.write("mapdiv");
    });
}

//update norway heatMap (user access location)
function updateMapData(data) {
    // generate new values
    map.dataProvider.areas[0].value = data.Akershus.value;
    map.dataProvider.areas[1].value = data.Ostfold.value;
    map.dataProvider.areas[2].value = data.Oslo.value;
    map.dataProvider.areas[3].value = data.Hedmark.value;
    map.dataProvider.areas[4].value = data.Oppland.value;
    map.dataProvider.areas[5].value = data.Buskerud.value;
    map.dataProvider.areas[6].value = data.Vestfold.value;
    map.dataProvider.areas[7].value = data.Telemark.value;
    map.dataProvider.areas[8].value = data.AustAgder.value;
    map.dataProvider.areas[9].value = data.VestAgder.value;
    map.dataProvider.areas[10].value = data.Rogaland.value;
    map.dataProvider.areas[11].value = data.Hordaland.value;
    map.dataProvider.areas[12].value = data.SognOgFjordane.value;
    map.dataProvider.areas[13].value = data.MoreOgRomsdal.value;
    map.dataProvider.areas[14].value = data.SorTrondelag.value;
    map.dataProvider.areas[15].value = data.NordTrondelag.value;
    map.dataProvider.areas[16].value = data.Nordland.value;
    map.dataProvider.areas[17].value = data.Troms.value;
    map.dataProvider.areas[18].value = data.Finnmark.value;

    // update map
    map.validateNow();
}

//Most popular pages / Least popular pages
function updatePopularPages(data) {
    document.getElementById("popularNO-one").innerHTML = data.popularNO.one;
    document.getElementById("popularNO-two").innerHTML = data.popularNO.two;
    document.getElementById("popularNO-three").innerHTML = data.popularNO.three;
    document.getElementById("popularNO-four").innerHTML = data.popularNO.four;
    document.getElementById("popularNO-five").innerHTML = data.popularNO.five;

    document.getElementById("popularEDU-one").innerHTML = data.popularEDU.one;
    document.getElementById("popularEDU-two").innerHTML = data.popularEDU.two;
    document.getElementById("popularEDU-three").innerHTML = data.popularEDU.three;
    document.getElementById("popularEDU-four").innerHTML = data.popularEDU.four;
    document.getElementById("popularEDU-five").innerHTML = data.popularEDU.five;
}

//--------------------Second page------------------------//

//update Study pages
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

    document.getElementById("study-increasing-one").innerHTML = data.increasing.one.url;
    document.getElementById("study-increasing-two").innerHTML = data.increasing.two.url;
    document.getElementById("study-increasing-three").innerHTML = data.increasing.three.url;
    document.getElementById("study-increasing-four").innerHTML = data.increasing.four.url;
    document.getElementById("study-increasing-five").innerHTML = data.increasing.five.url;

    document.getElementById("study-change-one").className = "ion-arrow-graph-" + data.increasing.one.change + "-right bigArrow";
    document.getElementById("study-change-two").className = "ion-arrow-graph-" + data.increasing.two.change + "-right bigArrow";
    document.getElementById("study-change-three").className = "ion-arrow-graph-" + data.increasing.three.change + "-right bigArrow";
    document.getElementById("study-change-four").className = "ion-arrow-graph-" + data.increasing.four.change + "-right bigArrow";
    document.getElementById("study-change-five").className = "ion-arrow-graph-" + data.increasing.five.change + "-right bigArrow";

}

function updateWorldChart(data) {
    data.one["color"] = "#8BD22F";
    data.two["color"] = "#AAD75A";
    data.three["color"] = "#77C68D";
    data.four["color"] = "#44B5C0";
    data.five["color"] = "#11A4F3";
    worldChart.dataProvider = [data.one,data.two,data.three,data.four,data.five];
    worldChart.validateData();
}

function makeWorldChart() {
    worldChart = AmCharts.makeChart("worldChart", {
        "type": "serial",
        "theme": "light",
        "color": "#FFFFFF",
        "creditsPosition" : "top-right",
        "marginRight": 40,
        "dataProvider": [],

        "startDuration": 1,
        "graphs": [{
            "balloonText": "<b>[[category]]: [[value]]</b>",
            "fillColorsField": "color",
            "fillAlphas": 0.9,
            "lineAlpha": 0.2,
            "type": "column",
            "valueField": "visits"
        }],
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "country",
        "categoryAxis": {
            "gridPosition": "start",
            "labelRotation": 30,
            "fontSize": 18,
            "titleBold":true
        },
        "export": {
            "enabled": true
        }

    });

}

//--------------------Third page-------------------------//
// Innsida / Tema / Wiki
// Make chart for last week and this week page views
function makeWeekCharts() {
    makeInnsidaWeekChart();
    makeTemaWeekChart();
    makeWikiWeekChart();
}

//TODO: Make chart text a little bit bigger in the three following charts?
function makeInnsidaWeekChart() {
    var chartData = [
        {
            "date": "2016-07-11",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-07-12",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-07-13",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-07-14",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-07-15",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-07-16",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-07-17",
            "lastWeek": 0,
            "thisWeek": 0
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
        innsidaVisitorChart.marginRight = 0;


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

function makeTemaWeekChart() {
    var chartData = [
        {
            "date": "2016-01-11",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-12",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-13",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-14",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-15",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-16",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-17",
            "lastWeek": 0,
            "thisWeek": 0
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
        temaVisitorChart.marginRight = 0;

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

function makeWikiWeekChart() {
    var chartData = [
        {
            "date": "2016-01-11",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-12",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-13",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-14",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-15",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-16",
            "lastWeek": 0,
            "thisWeek": 0

        },
        {
            "date": "2016-01-17",
            "lastWeek": 0,
            "thisWeek": 0
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
        temaVisitorChart.marginRight = 0;

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

//Update everything with data from firebase
//method is called three times. One for each: innsida, tema and wiki.
function updateInnsidaWikiTema(data,pageName, chart) {
    // broken URL
    document.getElementById(pageName+"BrokenLinks").innerHTML = data.brokenUrls.number;
    document.getElementById(pageName+"URLArrow").className = "ion-arrow-graph-" + data.brokenUrls.change + "-right bigArrow reverse";
    document.getElementById(pageName+"BrokenURLpercent").innerHTML = data.brokenUrls.percent;
    //popular pages
    document.getElementById(pageName+"PopularPage-one").innerHTML = data.popular.pages.one;
    document.getElementById(pageName+"PopularPage-two").innerHTML = data.popular.pages.two;
    document.getElementById(pageName+"PopularPage-three").innerHTML = data.popular.pages.three;
    //popular search words
    document.getElementById(pageName+"PopularSearch-one").innerHTML = data.popular.searches.one;
    document.getElementById(pageName+"PopularSearch-two").innerHTML = data.popular.searches.two;
    document.getElementById(pageName+"PopularSearch-three").innerHTML = data.popular.searches.three;
    //visitor charts
    var days = data.visitors;
    chart.dataProvider =
        [
            days.monday,
            days.thuesday,
            days.wednesday,
            days.thursday,
            days.friday,
            days.saturday,
            days.sunday
        ];
    chart.ignoreZoomed = true;
    chart.startDate = new Date(days.monday.date);
    chart.endDate = new Date(days.sunday.date);
    chart.zoomToDates(innsidaVisitorChart.startDate, innsidaVisitorChart.endDate);
    chart.validateData();
}

//--------------------Forth page------------------------//

// Make innsida Student vs staff views charts
function makeInnsidaVersusCharts() {
    makeTrondheimVersus();
    makeGjovikVersus();
    makeAalesundVersus();
}

function makeTrondheimVersus() {
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
            person: "Students",
            visits: 0,
            color: "#03A9FC"
        },
        {
            person: "Staff",
            visits: 0,
            color: "#F95372"
        }
    ];

    //Set percentage field for amount of visited people out of potential visitors
    allLabels[2].text = (((chartData[0].visits + chartData[1].visits)/total)*100).toFixed(1).toString() + "%";

    AmCharts.ready(function () {
        TrondheimVersuschart = new AmCharts.AmPieChart();
        TrondheimVersuschart.dataProvider = chartData;
        TrondheimVersuschart.allLabels = allLabels;
        TrondheimVersuschart.titleField = "person";
        TrondheimVersuschart.valueField = "visits";
        TrondheimVersuschart.colorField = "color";
        TrondheimVersuschart.sequencedAnimation = false;
        TrondheimVersuschart.innerRadius = "60%";
        TrondheimVersuschart.radius = "40%";
        TrondheimVersuschart.color = "white";
        TrondheimVersuschart.creditsPosition = "top-right";

        TrondheimVersuschart.labelsEnabled = false;
        TrondheimVersuschart.autoMargins = false;
        TrondheimVersuschart.marginTop = 0;
        TrondheimVersuschart.marginBottom = 0;
        TrondheimVersuschart.marginLeft = 0;
        TrondheimVersuschart.marginRight = 0;
        TrondheimVersuschart.pullOutRadius = 0;

        TrondheimVersuschart.write("innsidaTrondheim");
})
}

function makeAalesundVersus() {

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
            "visits": 0,
            "color": "#03A9FC"
        },
        {
            "person": "Staff",
            "visits": 0,
            "color": "#F95372"
        }
    ];
    //Set percentage field for amount of visited people out of potential visitors
    allLabels[2].text = (((chartData[0].visits + chartData[1].visits)/total)*100).toFixed(1).toString() + "%";

    AmCharts.ready(function () {
        AalesundVersuschart = new AmCharts.AmPieChart();
        AalesundVersuschart.dataProvider = chartData;
        AalesundVersuschart.allLabels = allLabels;
        AalesundVersuschart.titleField = "person";
        AalesundVersuschart.valueField = "visits";
        AalesundVersuschart.colorField = "color";
        AalesundVersuschart.sequencedAnimation = false;
        AalesundVersuschart.innerRadius = "60%";
        AalesundVersuschart.radius = "40%";
        AalesundVersuschart.color = "white";
        AalesundVersuschart.creditsPosition = "top-right";

        AalesundVersuschart.labelsEnabled = false;
        AalesundVersuschart.autoMargins = false;
        AalesundVersuschart.marginTop = 0;
        AalesundVersuschart.marginBottom = 0;
        AalesundVersuschart.marginLeft = 0;
        AalesundVersuschart.marginRight = 0;
        AalesundVersuschart.pullOutRadius = 0;

        AalesundVersuschart.write("innsidaAalesund");
    })
}

function makeGjovikVersus() {
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
            "visits": 0,
            "color": "#03A9FC"
        },
        {
            "person": "Staff",
            "visits": 0,
            "color": "#F95372",
        }
    ];
    //Set percentage field for amount of visited people out of potential visitors
    allLabels[2].text = (((chartData[0].visits + chartData[1].visits)/total)*100).toFixed(1).toString() + "%";

    AmCharts.ready(function () {
        GjovikVersuschart = new AmCharts.AmPieChart();
        GjovikVersuschart.dataProvider = chartData;
        GjovikVersuschart.allLabels = allLabels;
        GjovikVersuschart.titleField = "person";
        GjovikVersuschart.valueField = "visits";
        GjovikVersuschart.colorField = "color";
        GjovikVersuschart.sequencedAnimation = false;
        GjovikVersuschart.innerRadius = "60%";
        GjovikVersuschart.radius = "40%";
        GjovikVersuschart.color = "white";
        GjovikVersuschart.creditsPosition = "top-right";

        GjovikVersuschart.labelsEnabled = false;
        GjovikVersuschart.autoMargins = false;
        GjovikVersuschart.marginTop = 0;
        GjovikVersuschart.marginBottom = 0;
        GjovikVersuschart.marginLeft = 0;
        GjovikVersuschart.marginRight = 0;
        GjovikVersuschart.pullOutRadius = 0;

        GjovikVersuschart.write("innsidaGjovik");
    })
}

//update charts with data from firebase
function updateVersusCharts(data) {
    var TrondheimData = data.Trondheim;
    TrondheimVersuschart.dataProvider = [TrondheimData.students, TrondheimData.staff];
    TrondheimVersuschart.allLabels[2].text = (((TrondheimData.students.visits + TrondheimData.staff.visits)/TrondheimData.averageVisits)*100).toFixed(1).toString() + "%";
    TrondheimVersuschart.validateData();


    var AalesundData = data.Aalesund;
    AalesundVersuschart.dataProvider = [AalesundData.students, AalesundData.staff];
    AalesundVersuschart.allLabels[2].text = (((AalesundData.students.visits + AalesundData.staff.visits)/AalesundData.averageVisits)*100).toFixed(1).toString() + "%";
    AalesundVersuschart.validateData();

    var GjovikData = data.Gjovik;
    GjovikVersuschart.dataProvider = [GjovikData.students, GjovikData.staff];
    GjovikVersuschart.allLabels[2].text = (((GjovikData.students.visits + GjovikData.staff.visits)/GjovikData.averageVisits)*100).toFixed(1).toString() + "%";
    GjovikVersuschart.validateData();
}

//--------------------Fifth page------------------------//

//update everything with data from firebase
function updateGemini(data) {
    updateElement("gemini-headline-one",data.headlines.one);
    updateElement("gemini-tag-one",data.tag.one);
    updateElement("gemini-headline-two",data.headlines.two);
    updateElement("gemini-tag-two",data.tag.two);
    updateElement("gemini-headline-three",data.headlines.three);
    updateElement("gemini-tag-three",data.tag.three);
    updateElement("gemini-headline-four",data.headlines.four);
    updateElement("gemini-tag-four",data.tag.four);
    updateElement("gemini-headline-five",data.headlines.five);
    updateElement("gemini-tag-five",data.tag.five);
    updateElement("gemini-headline-six",data.headlines.six);
    updateElement("gemini-tag-six",data.tag.six);
    updateElement("gemini-headline-seven",data.headlines.seven);
    updateElement("gemini-tag-seven",data.tag.seven);
    updateElement("gemini-headline-eight",data.headlines.eight);
    updateElement("gemini-tag-eight",data.tag.eight);
    updateElement("gemini-headline-nine",data.headlines.nine);
    updateElement("gemini-tag-nine",data.tag.nine);
    updateElement("gemini-headline-ten",data.headlines.ten);
    updateElement("gemini-tag-ten",data.tag.ten);
}

function updateGeminiImages(data) {
    document.getElementById("gemini-img-one").src = data.one;
    document.getElementById("gemini-img-two").src = data.two;
    document.getElementById("gemini-img-three").src = data.three;
    document.getElementById("gemini-img-four").src = data.four;
    document.getElementById("gemini-img-five").src = data.five;
    document.getElementById("gemini-img-six").src = data.six;
    document.getElementById("gemini-img-seven").src = data.seven;
    document.getElementById("gemini-img-eight").src = data.eight;
    document.getElementById("gemini-img-nine").src = data.nine;
    document.getElementById("gemini-img-ten").src = data.ten;
}

//helper method for updating html element by id.
function updateElement(id, value) {
    document.getElementById(id).innerHTML = value;
}

//--------------------General------------------------//
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
//Clock helper function
function prefixZero(hour, min, sec) {
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


