/**
 * Created by thomasandersen on 20.06.2016.
 */
$(document).ready(function(){
    //charts and map global variables.
    var map;
    var worldMap;
    var devicechart;
    var innsidaWeekChart;
    //var innsidaVisitorChart;
    //var temaVisitorChart;
    //var wikiVisitorChart;
    //var TrondheimVersuschart;
    //var AalesundVersuschart;
    //var GjovikVersuschart;
    var worldChart;
    var monthChart;
    var hourlyVisitsChart;
    var nationalChart;
    var internationalChart;
    var hourlyNTNUVisitsChart;
    init();

    $('.tooltip-region').hover(function(){
        var width = $(this).parent().parent().width();
        $('body').append("<div id='hoveringTooltip' style='position:fixed; height: 10%; background-color: #222222' class='panel'></div>");
        $('#hoveringTooltip').html($(this).parent().parent().children()[4].textContent);
        $('#hoveringTooltip').css({
            "top" : $(this).parent().parent().offset().top + 40,
            "left" : $(this).parent().parent().offset().left,
            "width":width
        });
    });
    $('.tooltip-region').mouseleave(function(){
        $('#hoveringTooltip').css({
            "-webkit-animation": "1s ease-out"
        });
        $('#hoveringTooltip').remove();
    });

});

//Set up charts // Init Firebase // Collect data from firebase
function init(){

    imgSize = $(window).width() / 100;
    //retrieverFeed();

    //makeMap();
    makeWorldMap();
    makeHourlyNTNUVisitorsChart();
    makeDeviceChart();
    makeInnsidaWeekChart();
    /*makeInnsidaVersusCharts();*/
    makeWorldChart();
    makeMonthChart();
    makeHourlyVisitsChart();
    document.getElementById("navbarPageName").innerHTML = $(".active").attr("id");
    //makeRetrieverNationalChart();
    //makeRetrieverInternationalChart();
    //makeWeekChart();
    setInterval(getClock, 1000);

    $("#myCarousel").bind('slide.bs.carousel', function (e) {
        updateNavPageName(e.relatedTarget.id);
    });

    //setTimeout(pageInfo, 1000);
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
    document.getElementById("controller").style.opacity = "1.0";
    setTimeout(showPage, 500);
    /*timeout = 4000*/
}

function updateNavPageName(id) {
    document.getElementById("navbarPageName").innerHTML = id;
}

function showPage() {
    document.getElementById("wrapper").style.display = "none";
    document.getElementById("controller").style.opacity = ".0";
    document.getElementById("notifier").style.display = "none";
    document.getElementById("myCarousel").style.display = "block";
}

function pageInfo() {
    document.getElementById("firstPageInfo").style.display = "block";
    setTimeout(function() {
        document.getElementById("firstPageInfo").className = "pageInfo animated zoomOut";
        //document.getElementById("firstPageInfo").style.display = "none";
    }, 3000);
}

//update everything with data from firebase
function updateEverything(data) {
    updateVisitors(data.ew.visitors.visitorCount, "External");
    updateVisitors(data.innsida.visitors, "Innsida");
    updateBrowserTable(data.ew.visitors.browsers, imgSize);
    updatePopularPages(data.ew.visitors.popularPages);
    //updateMapData(data.ew.visitors.heatmap);
    updateDeviceChart(data.ew.visitors.platform);
    updateInnsidaWeekChart(data.innsida.visitors);
    updateInnsidaPopularPages(data.innsida.popular);

    updateStudyPage(data.study);
    //updateInnsidaWikiTema(data.innsida,"innsida", innsidaVisitorChart);
    //updateInnsidaWikiTema(data.tema,"tema", temaVisitorChart);
    //updateInnsidaWikiTema(data.wiki,"wiki", wikiVisitorChart);
    //updateVersusCharts(data.innsida.versusChart);
    updateGemini(data.gemini);
    updateWorldChart(data.ew.visitors.worldVisits);
    updateGeminiImages(data.gemini.image);
    //setInterval(validateMap, 20000);
    updateMonthChart(data.study.visitorsByMonth);
    updateHourlyVisitsChart(data.innsida.visitors.hourly);
    updateHourlyNTNUVisitorsChart(data.ew.visitors.hourly);
    updateBrokenUrls(data.ew.brokenUrls);
    updateWorldMap(data.ew.visitors.worldMap);
    //updateRetrieverNationalChart(data.retriever.national);
}

//------------------Used on more than one page----------//

//# Visitors ntnu.no and innsida // Last week / Last Month / Last Year
function updateVisitors(data, page) {
    document.getElementById("currentVisitors" + page).innerHTML = data.current;
    var week = data.lastWeek;
    updateIntervalPercentArrows(week.change, "Week", page);
    var month = data.lastMonth;
    updateIntervalPercentArrows(month.change, "Month", page);
    var year = data.lastYear;
    updateIntervalPercentArrows(year.change, "Year", page);

    document.getElementById("changeWeek" + page).innerHTML = week.percent;
    document.getElementById("weekPercent" + page).innerHTML = "%";
    document.getElementById("changeMonth" + page).innerHTML = month.percent;
    document.getElementById("monthPercent" + page).innerHTML = "%";
    document.getElementById("changeYear" + page).innerHTML = year.percent;
    document.getElementById("yearPercent" + page).innerHTML = "%";
}

//helper method for direction of arrows
function updateIntervalPercentArrows(value, name, page) {
    var id = name.toLowerCase() + "Arrow" + page;
    document.getElementById(id).className = "ion-arrow-graph-" + value + "-right";

}


//--------------------First page------------------------//

function makeWorldMap() {
    // svg path for target icon
    var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

    worldMap = AmCharts.makeChart( "worldMapDiv", {
        "type": "map",
        "theme": "none",
        "color":"white",
        "dataProvider": {
            "map": "worldLow",
            "zoomLevel": 2.1,
            "zoomLongitude": 10.399732,
            "zoomLatitude": 63.4175868,

            "lines": [ /*{
                "latitudes": [ 50.4422, 63.4175868 ],
                "longitudes": [ 30.5367, 10.399732 ]
            }, {
                "latitudes": [ 46.9480, 63.4175868 ],
                "longitudes": [ 7.4481, 10.399732 ]
            }, {
                "latitudes": [ 59.3328, 63.4175868 ],
                "longitudes": [ 18.0645, 10.399732 ]
            }, {
                "latitudes": [  40.4167, 63.4175868 ],
                "longitudes": [ -3.7033, 10.399732 ]
            }, {
                "latitudes": [ 46.0514, 63.4175868 ],
                "longitudes": [ 14.5060, 10.399732 ]
            }, {
                "latitudes": [  48.2116, 63.4175868 ],
                "longitudes": [ 17.1547, 10.399732 ]
            }, {
                "latitudes": [ 44.8048, 63.4175868 ],
                "longitudes": [ 20.4781, 10.399732 ]
            }, {
                "latitudes": [ 55.7558, 63.4175868 ],
                "longitudes": [ 37.6176, 10.399732 ]
            }, {
                "latitudes": [ 38.7072, 63.4175868 ],
                "longitudes": [ -9.1355, 10.399732 ]
            }, {
                "latitudes": [ 64.1353, 63.4175868 ],
                "longitudes": [ -21.8952, 10.399732 ]
            }, {
                "latitudes": [ 40.4300, 63.4175868 ],
                "longitudes": [ -74.0000, 10.399732 ],
                "thickness": 4
            }*/ ],
            "images": [
                /*{
                    "svgPath": targetSVG,
                    "title": "Trondheim",
                    "latitude": 63.4175868,
                    "longitude": 10.399732,
                    "scale": 1
                }, {
                    "svgPath": targetSVG,
                    "title": "Reykjavik",
                    "latitude": 64.1353,
                    "longitude": -21.8952,
                    "scale": 0.5
                }, {
                    "svgPath": targetSVG,
                    "title": "Lisbon",
                    "latitude": 38.7072,
                    "longitude": -9.1355,
                    "scale": 0.5
                }, {
                    "svgPath": targetSVG,
                    "title": "Moscow",
                    "latitude": 55.7558,
                    "longitude": 37.6176,
                    "scale": 0.5
                }, {
                    "svgPath": targetSVG,
                    "title": "Belgrade",
                    "latitude": 44.8048,
                    "longitude": 20.4781,
                    "scale": 0.5
                }, {
                    "svgPath": targetSVG,
                    "title": "Bratislava",
                    "latitude": 48.2116,
                    "longitude": 17.1547,
                    "scale": 0.5
                }, {
                    "svgPath": targetSVG,
                    "title": "Ljubljana",
                    "latitude": 46.0514,
                    "longitude": 14.5060,
                    "scale": 0.5
                }, {
                    "svgPath": targetSVG,
                    "title": "Madrid",
                    "latitude": 40.4167,
                    "longitude": -3.7033,
                    "scale": 0.5
                }, {
                    "svgPath": targetSVG,
                    "title": "Stockholm",
                    "latitude": 59.3328,
                    "longitude": 18.0645,
                    "scale": 0.5
                }, {
                    "svgPath": targetSVG,
                    "title": "Bern",
                    "latitude": 46.9480,
                    "longitude": 7.4481,
                    "scale": 0.5
                }, {
                    "svgPath": targetSVG,
                    "title": "Kiev",
                    "latitude": 50.4422,
                    "longitude": 30.5367,
                    "scale": 0.5
                }, {
                    "svgPath": targetSVG,
                    "title": "New York",
                    "latitude": 40.43,
                    "longitude": -74,
                    "scale": 0.5
                }*/ ]
        },

        "areasSettings": {
            "unlistedAreasColor": "#03A9FC",
            "unlistedAreasAlpha": 0.9
        },

        "imagesSettings": {
            "color": "#F05576",
            "rollOverColor": "#F05576",
            "selectedColor": "#000000"
        },

        "linesSettings": {
            "arc": -0.8, // this makes lines curved. Use value from -1 to 1
            "arrow": "middle",
            "color": "#F05576",
            "alpha": 0.7,
            "arrowAlpha": 1,
            "arrowSize": 6
        },
        /*"zoomControl": {
            "gridHeight": 100,
            "draggerAlpha": 1,
            "gridAlpha": 0.2
        },*/

        "backgroundZoomsToTop": true,
        "linesAboveImages": true,

        "export": {
            "enabled": false
        }
    } );
}

function updateWorldMap(data) {
    var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";
    var trondheimLat =  63.4175868;
    var trondheimLng = 10.399732;
    var Trondheim = {
        "svgPath": targetSVG,
        "title": "Trondheim",
        "latitude": 63.4175868,
        "longitude": 10.399732,
        "scale": 1
    };
    var places = [];
    var lines = [];
    places.push(Trondheim);

    for (var element in data) {
        var place = data[element];
        var line = {
            latitudes : [place.latitude, trondheimLat],
            longitudes : [place.longitude, trondheimLng],
            thickness : place.value
        };
        place.svgPath = targetSVG;
        places.push(place);
        lines.push(line);
    }
    worldMap.dataProvider.images = places;
    worldMap.dataProvider.lines = lines;
    worldMap.validateData();
    worldMap.validateNow();


}


//BrowserTable
function updateBrowserTable(data, imgSize) {
    imgSize +=1;
    var firefox = data.Firefox;
    var chrome = data.Chrome;
    var ie = data.IE;
    var safari = data.Safari;
    var opera = data.Opera;
    var edge = data.Edge;
    var array = [firefox, chrome, ie, safari, opera, edge];
    var sorted = array.sort(function(a, b) {return parseInt(a.numbers) - parseInt(b.numbers);});
    var logoStartString = '<img src="img/';
    var logoEndString = '.svg" height="' + imgSize + '" width="'+ imgSize +'">';

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
        /*devicechart.labelRadius = 5;*/
        devicechart.labelsEnabled = false;
        devicechart.color = "white";
        devicechart.balloonText = "[[title]] users<br><span style='font-size:1vw; font-weight: bold'><b>[[value]]</b> ([[percents]]%)</span>";
        devicechart.autoMargins = false;
        devicechart.fontSize = 18;
        devicechart.marginTop = 0;
        devicechart.marginBottom = 0;
        devicechart.marginLeft = 0;
        devicechart.marginRight = 0;
        devicechart.pullOutRadius = 0;
        devicechart.creditsPosition = "bottom-left";

        var legend = new AmCharts.AmLegend();
        legend.bulletType = "round";
        legend.equalWidths = false;
        legend.valueWidth = 40;
        legend.marginLeft = 0;
        legend.position = "right";
        legend.useGraphSettings = false;
        legend.color = "#FFFFFF";
        legend.fontSize = $(window).width() /100;
        devicechart.addLegend(legend);

        // WRITE
        devicechart.write("devicediv");
    });
}

//update DeviceChart (platform)
function updateDeviceChart(data) {
    devicechart.dataProvider = [data.computer,data.smartphone,data.tablet];
    devicechart.validateData();
}

//Most popular pages / Least popular pages
function updatePopularPages(data) {
    document.getElementById("popularNO-one").innerHTML = data.popularNO.one;
    document.getElementById("popularNO-two").innerHTML = data.popularNO.two;
    document.getElementById("popularNO-three").innerHTML = data.popularNO.three;
    document.getElementById("popularNO-four").innerHTML = data.popularNO.four;
    document.getElementById("popularNO-five").innerHTML = data.popularNO.five;
}


function makeHourlyNTNUVisitorsChart() {
    hourlyNTNUVisitsChart = AmCharts.makeChart("NTNUhourlyVisitorChart", {
        "type": "radar",
        "theme": "light",
        "color":"#FFFFFF",
        "creditsPosition":"bottom-left",
        "dataProvider": [],
        "valueAxes": [ {
            "axisTitleOffset": 5,
            "minimum": 0,
            "axisAlpha": 0.45,
            "axisColor":"#FFFFFF",
            "gridThickness": 2,
            "gridColor":"#FFFFFF",
            "labelsEnabled": false,
            "fontSize": $(window).width() /100
        } ],
        "startDuration": 2,
        "graphs": [ {
            "balloonText": "On average [[visits]] visits at [[hour]] last 30 days",
            "bullet": "round",
            "lineThickness": 4,
            "valueField": "visits",
            "bulletColor": "#8BD25F",
            "lineColor":"#8BD25F",
            "bulletSize": 4
        } ],
        "categoryField": "hour",
        "export": {
            "enabled": false
        }
    } );
}

function updateHourlyNTNUVisitorsChart(data) {
    /*hourlyVisitsChart.dataProvider = [
     data.zero, data.one, data.two, data.three, data.four, data.five,
     data.six, data.seven, data.eight, data.nine, data.ten, data.eleven,
     data.twelve, data.thirteen, data.fourteen, data.fifteen, data.sixteen, data.seventeen,
     data.eighteen, data.nineteen, data.twenty, data.twentyone, data.twentytwo, data.twentythree
     ];*/
    hourlyNTNUVisitsChart.dataProvider = [
        data.zero, data.two, data.four, data.six, data.eight, data.ten,
        data.twelve, data.fourteen, data.sixteen, data.eighteen, data.twenty, data.twentytwo
    ];
    hourlyNTNUVisitsChart.validateData();
}

function updateBrokenUrls(data) {
    //ion-arrow-graph-down-right reverse
    var className = "";
    if (data.lastWeek.change == "up") {
        className = "ion-arrow-graph-up-right reverse"
    }
    else {
        className = "ion-arrow-graph-down-right reverse";
    }
    document.getElementById("brokenArrow").className = className;
    document.getElementById("linksBroken").innerHTML = data.brokenLinks;
    document.getElementById("brokenPercent").innerHTML = data.lastWeek.percent;
    document.getElementById("brokenClicks").innerHTML = data.clicksOnLinks;
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
            "enabled": false
        }

    });

}

function updateMonthChart(data) {
    monthChart.dataProvider = [
        data.jan,data.feb,data.mar,data.apr,
        data.may,data.jun,data.jul,data.aug,
        data.sep,data.oct,data.nov,data.dec];
    monthChart.validateData();
}

function makeMonthChart() {
    monthChart = AmCharts.makeChart("monthChart", {
            "type": "serial",
            "theme": "light",
            "color": "#FFFFFF",
            "creditsPosition":"top-right",
            "legend": {
                "equalWidths": false,
                "useGraphSettings": false,
                "valueAlign": "left",
                "valueWidth": 180,
                "color":"#FFFFFF",
                "fontSize":13,
                "align":"left"
            },
            "valueAxes": [{
                "id":"v1",
                "axisAlpha": 0,
                "position": "left"
            }],
            "graphs": [{
                "id": "g1",
                "lineColor":"#8BD25F",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#8BD25F",
                "legendPeriodValueText": "Total: [[value.sum]] views",
                "balloonText": "[[value]] visits [[month]] this year",
                "bulletSize": 10,
                "lineThickness": 5,
                "title": "This year.",
                "useLineColorForBulletBorder": true,
                "valueField": "thisYear"
            },
                {
                    "id": "g2",
                    "lineColor":"#F95372",
                    "bullet": "round",
                    "bulletBorderAlpha": 1,
                    "bulletColor": "#F95372",
                    "legendPeriodValueText": "Total: [[value.sum]] views",
                    "balloonText": "[[value]] visits [[month]] last year",
                    "bulletSize": 10,
                    "lineThickness": 5,
                    "title": "Last year.",
                    "useLineColorForBulletBorder": true,
                    "valueField": "lastYear"
                }],
            "categoryField": "month",
            "categoryAxis": {
                "parseDates": false,
                "dashLength": 1,
                "minorGridEnabled": false,
                "position": "bottom",
                "fontSize":16
                //"axisColor" : "#FFFFFF"
            },
            "dataProvider": []
        }
    );

}

//--------------------Third page-------------------------//
// Innsida / Tema / Wiki
// Make chart for last week and this week page views

function makeInnsidaWeekChart() {
    innsidaWeekChart = AmCharts.makeChart("innsidaWeekChart", {
            "type": "serial",
            "theme": "light",
            "color": "#FFFFFF",
            "creditsPosition":"top-right",
            "legend": {
                "equalWidths": false,
                "useGraphSettings": false,
                "valueAlign": "left",
                "valueWidth": 180,
                "color":"#FFFFFF",
                "fontSize":13,
                "align":"left"
            },
            "valueAxes": [{
                "id":"v1",
                "axisAlpha": 0,
                "position": "left"
            }],
            "graphs": [{
                "id": "g1",
                "lineColor":"#8BD25F",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#8BD25F",
                "legendPeriodValueText": "Total: [[value.sum]] views",
                "balloonText": "[[value]] visits [[day]] this week",
                "bulletSize": 10,
                "lineThickness": 5,
                "title": "This week.",
                "useLineColorForBulletBorder": true,
                "valueField": "thisWeek"
            },
                {
                    "id": "g2",
                    "lineColor":"#F95372",
                    "bullet": "round",
                    "bulletBorderAlpha": 1,
                    "bulletColor": "#F95372",
                    "legendPeriodValueText": "Total: [[value.sum]] views",
                    "balloonText": "[[value]] visits [[day]] last week",
                    "bulletSize": 10,
                    "lineThickness": 5,
                    "title": "Last week.",
                    "useLineColorForBulletBorder": true,
                    "valueField": "lastWeek"
                }],
            "categoryField": "day",
            "categoryAxis": {
                "parseDates": false,
                "dashLength": 1,
                "minorGridEnabled": false,
                "position": "bottom",
                "fontSize":16
                //"axisColor" : "#FFFFFF"
            },
            "dataProvider": []
        }
    );

}

function updateInnsidaWeekChart(data) {
    innsidaWeekChart.dataProvider = [data.monday,data.tuesday,data.wednesday,data.thursday,data.friday,data.saturday,data.sunday];
    innsidaWeekChart.validateData();
}

function updateInnsidaPopularPages(data) {
    document.getElementById("popularWiki-one").innerHTML = data.popularWiki.one;
    document.getElementById("popularWiki-two").innerHTML = data.popularWiki.two;
    document.getElementById("popularWiki-three").innerHTML = data.popularWiki.three;
    document.getElementById("popularWiki-four").innerHTML = data.popularWiki.four;
    document.getElementById("popularWiki-five").innerHTML = data.popularWiki.five;

    document.getElementById("mostPopularTema-one").innerHTML = data.mostPopularTema.one;
    document.getElementById("mostPopularTema-two").innerHTML = data.mostPopularTema.two;
    document.getElementById("mostPopularTema-three").innerHTML = data.mostPopularTema.three;
    document.getElementById("mostPopularTema-four").innerHTML = data.mostPopularTema.four;
    document.getElementById("mostPopularTema-five").innerHTML = data.mostPopularTema.five;

    document.getElementById("leastPopularTema-one").innerHTML = data.leastPopularTema.one;
    document.getElementById("leastPopularTema-two").innerHTML = data.leastPopularTema.two;
    document.getElementById("leastPopularTema-three").innerHTML = data.leastPopularTema.three;
    document.getElementById("leastPopularTema-four").innerHTML = data.leastPopularTema.four;
    document.getElementById("leastPopularTema-five").innerHTML = data.leastPopularTema.five;
}

function makeHourlyVisitsChart() {
    hourlyVisitsChart = AmCharts.makeChart("hourlyVisitsChart", {
        "type": "radar",
        "theme": "light",
        "color":"#FFFFFF",
        "creditsPosition":"top-right",
        "dataProvider": [],
        "valueAxes": [ {
            "axisTitleOffset": 20,
            "minimum": 0,
            "axisAlpha": 0.45,
            "axisColor":"#FFFFFF",
            "gridThickness": 2,
            "gridColor":"#FFFFFF",
            "labelsEnabled": false
        } ],
        "startDuration": 2,
        "graphs": [ {
            "balloonText": "On average [[visits]] visits at [[hour]] last 30 days",
            "bullet": "round",
            "lineThickness": 4,
            "valueField": "visits",
            "bulletColor": "#8BD25F",
            "lineColor":"#8BD25F",
            "bulletSize": 4
        } ],
        "categoryField": "hour",
        "export": {
            "enabled": false
        }
    } );
}

function updateHourlyVisitsChart(data) {
    /*hourlyVisitsChart.dataProvider = [
        data.zero, data.one, data.two, data.three, data.four, data.five,
        data.six, data.seven, data.eight, data.nine, data.ten, data.eleven,
        data.twelve, data.thirteen, data.fourteen, data.fifteen, data.sixteen, data.seventeen,
        data.eighteen, data.nineteen, data.twenty, data.twentyone, data.twentytwo, data.twentythree
    ];*/
     hourlyVisitsChart.dataProvider = [
     data.zero, data.two, data.four, data.six, data.eight, data.ten,
     data.twelve, data.fourteen, data.sixteen, data.eighteen, data.twenty, data.twentytwo
     ];
    hourlyVisitsChart.validateData();
}


/*function makeWeekCharts() {
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
        legend.fontSize = 16;
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
        legend.fontSize = 16;
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
        legend.fontSize = 16;
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
            days.tuesday,
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
*/
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
            "size":14,
            "bold":true,
            "y": 160
        },
        {
            "text": "online this week",
            "align": "center",
            "size":14,
            "bold":true,
            "y": 175
        },
        {
            "text": "35%",
            "align": "center",
            "bold":true,
            "size":22,
            "y": 130
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
            "size":14,
            "bold":true,
            "y": 160
        },
        {
            "text": "online this week",
            "align": "center",
            "size":14,
            "bold":true,
            "y": 175
        },
        {
            "text": "29%",
            "align": "center",
            "bold":true,
            "size":22,
            "y": 130
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
            "size":14,
            "bold":true,
            "y": 160
        },
        {
            "text": "online this week",
            "align": "center",
            "size":14,
            "bold":true,
            "y": 175
        },
        {
            "text": "29%",
            "align": "center",
            "bold":true,
            "size":22,
            "y": 130
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
    document.getElementById("innsidaTrondheimStaffCount").innerHTML = TrondheimData.staff.visits + " of " + TrondheimData.staff.potential;
    document.getElementById("innsidaTrondheimStudentCount").innerHTML = TrondheimData.students.visits + " of " + TrondheimData.students.potential;


    var AalesundData = data.Aalesund;
    AalesundVersuschart.dataProvider = [AalesundData.students, AalesundData.staff];
    AalesundVersuschart.allLabels[2].text = (((AalesundData.students.visits + AalesundData.staff.visits)/AalesundData.averageVisits)*100).toFixed(1).toString() + "%";
    AalesundVersuschart.validateData();
    document.getElementById("innsidaAalesundStaffCount").innerHTML = AalesundData.staff.visits + " of " + AalesundData.staff.potential;
    document.getElementById("innsidaAalesundStudentCount").innerHTML = AalesundData.students.visits + " of " + AalesundData.students.potential;

    var GjovikData = data.Gjovik;
    GjovikVersuschart.dataProvider = [GjovikData.students, GjovikData.staff];
    GjovikVersuschart.allLabels[2].text = (((GjovikData.students.visits + GjovikData.staff.visits)/GjovikData.averageVisits)*100).toFixed(1).toString() + "%";
    GjovikVersuschart.validateData();
    document.getElementById("innsidaGjovikStaffCount").innerHTML = GjovikData.staff.visits + " of " + GjovikData.staff.potential;
    document.getElementById("innsidaGjovikStudentCount").innerHTML = GjovikData.students.visits + " of " + GjovikData.students.potential;
}

//--------------------Fifth page------------------------//

//update everything with data from firebase
function updateGemini(data) {
    updateElement("gemini-headline-one",data.headlines.one, "h");
    updateElement("gemini-tag-one",data.tag.one, "t");
    updateElement("gemini-headline-two",data.headlines.two, "h");
    updateElement("gemini-tag-two",data.tag.two, "t");
    updateElement("gemini-headline-three",data.headlines.three, "h");
    updateElement("gemini-tag-three",data.tag.three, "t");
    updateElement("gemini-headline-four",data.headlines.four, "h");
    updateElement("gemini-tag-four",data.tag.four, "t");
    updateElement("gemini-headline-five",data.headlines.five, "h");
    updateElement("gemini-tag-five",data.tag.five, "t");
    updateElement("gemini-headline-six",data.headlines.six, "h");
    updateElement("gemini-tag-six",data.tag.six, "t");
    updateElement("gemini-headline-seven",data.headlines.seven, "h");
    updateElement("gemini-tag-seven",data.tag.seven, "t");
    updateElement("gemini-headline-eight",data.headlines.eight, "h");
    updateElement("gemini-tag-eight",data.tag.eight, "t");
    //updateElement("gemini-headline-nine",data.headlines.nine, "h");
    //updateElement("gemini-tag-nine",data.tag.nine, "t");
    //updateElement("gemini-headline-ten",data.headlines.ten, "h");
    //updateElement("gemini-tag-ten",data.tag.ten, "t");

    document.getElementById("gemini-url-one").setAttribute("href",data.url.one);
    document.getElementById("gemini-url-two").setAttribute("href",data.url.two);
    document.getElementById("gemini-url-three").setAttribute("href",data.url.three);
    document.getElementById("gemini-url-four").setAttribute("href",data.url.four);
    document.getElementById("gemini-url-five").setAttribute("href",data.url.five);
    document.getElementById("gemini-url-six").setAttribute("href",data.url.six);
    document.getElementById("gemini-url-seven").setAttribute("href",data.url.seven);
    document.getElementById("gemini-url-eight").setAttribute("href",data.url.eight);
    //document.getElementById("gemini-url-nine").setAttribute("href",data.url.nine);
    //document.getElementById("gemini-url-ten").setAttribute("href",data.url.ten);
}

function updateGeminiImages(data) {
    var images = [data.one, data.two, data.three, data.four, data.five, data.six, data.seven, data.eight];
    var translation = {0:"one",1:"two",2:"three",3:"four",4:"five",5:"six",6:"seven",7:"eight"};
    for (var i=0; i<images.length;i++){
        var id = "gemini-img-";
        if (images[i] != "") {
            id += translation[i];
            document.getElementById(id).src = images[i];
        }
        else {
            id += translation[i];
            document.getElementById(id).src = "img/placeholder.jpg";
        }
    }
}

//helper method for updating html element by id.
function updateElement(id, value, type) {
    /*if (type == "t" && value.length > 150) {
        document.getElementById(id).innerHTML = value.substring(0,150) + "...";
    }
    else if (type == "h" && value.length > 70) {
        document.getElementById(id).innerHTML = value.substring(0,46) + "...";
    }
    else {*/
        document.getElementById(id).innerHTML = value;
    /*}*/
}

//--------------------Fifth page------------------------//
//RETRIEVER
/*
function updateRetrieverNationalChart(data) {
    data.NTNU["color"] = "#FF0F00";
    data.UiO["color"] = "#FF6600";
    data.UiB["color"] = "#FF9E01";
    data.BI["color"] = "#FCD202";
    data.UiTo["color"] = "#F8FF01";
    data.UiA["color"] = "#B0DE09";
    data.NMBU["color"] = "#04D215";
    data.NHH["color"] = "#0D8ECF";
    data.Nord["color"] = "#0D52D1";
    data.UiS["color"] = "#2A0CD0";
    nationalChart.dataProvider = [
        data.NTNU,data.UiO,data.UiB, data.BI, data.UiTo, data.UiA,
        data.NMBU, data.NHH, data.Nord, data.UiS
    ];
    nationalChart.validateData();
}

function makeRetrieverNationalChart() {
    nationalChart = AmCharts.makeChart("nationalChart", {
        "type": "serial",
        "theme": "light",
        "color": "#FFFFFF",
        "creditsPosition":"top-right",
        "dataProvider": [],
        "valueAxes": [{
            "axisAlpha": 0,
            "position": "left",
            "title": "Articles",
            "titleFontSize" : 16
        }],
        "startDuration": 1,
        "graphs": [{
            "balloonText": "<b>[[category]]: [[value]]</b>",
            "fillColorsField": "color",
            "fillAlphas": 0.9,
            "lineAlpha": 0.2,
            "type": "column",
            "valueField": "articles"
        }],
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "uni",
        "categoryAxis": {
            "gridPosition": "start",
            "labelRotation": 30,
            "fontSize": 18,
            "titleBold": true
        },
        "export": {
            "enabled": false
        }

    });

}

function makeRetrieverInternationalChart() {
    internationalChart = AmCharts.makeChart("internationalChart", {
            "type": "serial",
            "theme": "light",
            "color": "#FFFFFF",
            "creditsPosition":"top-right",
            "autoMargins":true,
            "legend": {
                "equalWidths": true,
                "useGraphSettings": false,
                "valueAlign": "left",
                //"valueWidth": 280,
                "color":"#FFFFFF",
                "fontSize":14,
                "align":"left"
            },
            "valueAxes": [{
                "id":"v1",
                "axisAlpha": 0,
                "position": "left"
            }],
            "graphs": [{
                "id": "g1",
                "lineColor":"#8BD25F",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#8BD25F",
                //"legendPeriodValueText": "total: [[value.sum]]",
                "balloonText": "[[value]] articles for [[title]] in [[period]]",
                "bulletSize": 0,
                "lineThickness": 5,
                "title": "NTNU",
                "useLineColorForBulletBorder": true,
                "valueField": "NTNU"
            },
                {
                    "id": "g2",
                    "lineColor":"#F95372",
                    "bullet": "round",
                    "bulletBorderAlpha": 1,
                    "bulletColor": "#F95372",
                    //"legendPeriodValueText": "total: [[value.sum]]",
                    "balloonText": "[[value]] articles for [[title]] in [[period]]",
                    "bulletSize": 0,
                    "lineThickness": 5,
                    "title": "UiO",
                    "useLineColorForBulletBorder": true,
                    "valueField": "UiO"
                },
                {
                    "id": "g3",
                    "lineColor":"#03A9FC",
                    "bullet": "round",
                    "bulletBorderAlpha": 1,
                    "bulletColor": "#03A9FC",
                    //"legendPeriodValueText": "total: [[value.sum]]",
                    "balloonText": "[[value]] articles for [[title]] in [[period]]",
                    "bulletSize": 0,
                    "lineThickness": 5,
                    "title": "UiB",
                    "useLineColorForBulletBorder": true,
                    "valueField": "UiB"
                }],
            "categoryField": "period",
            "categoryAxis": {
                "parseDates": false,
                "dashLength": 1,
                "minorGridEnabled": false,
                "position": "bottom",
                "fontSize":12,
                "labelRotation": 30
            },
            "dataProvider": [
                {"NTNU":200,
                "UiB":100,
                "UiO":150,
                "period":"Q1-Q2 08"},
                {"NTNU":300,
                    "UiB":100,
                    "UiO":450,
                    "period":"Q3-Q4 08"},
                {"NTNU":200,
                    "UiB":310,
                    "UiO":250,
                    "period":"Q1-Q2 09"},
                {"NTNU":300,
                    "UiB":150,
                    "UiO":250,
                    "period":"Q3-Q4 09"},
                {"NTNU":200,
                    "UiB":100,
                    "UiO":150,
                    "period":"Q1-Q2 10"},
                {"NTNU":300,
                    "UiB":100,
                    "UiO":450,
                    "period":"Q3-Q4 10"},
                {"NTNU":200,
                    "UiB":310,
                    "UiO":250,
                    "period":"Q1-Q2 11"},
                {"NTNU":300,
                    "UiB":150,
                    "UiO":250,
                    "period":"Q3-Q4 11"},
                {"NTNU":200,
                    "UiB":100,
                    "UiO":150,
                    "period":"Q1-Q2 12"},
                {"NTNU":300,
                    "UiB":100,
                    "UiO":450,
                    "period":"Q3-Q4 12"},
                {"NTNU":200,
                    "UiB":310,
                    "UiO":250,
                    "period":"Q1-Q2 13"},
                {"NTNU":300,
                    "UiB":150,
                    "UiO":250,
                    "period":"Q3-Q4 13"}
            ]
        }
    );

}

function retrieverFeed() {
    var url = "https://www.retriever-info.com/feed/2002900/generelt43987/aktuelt_-_feed.xml";
    //var url = "https://www.retriever-info.com/feed/2002900/generell_arkiv166/aktuelt_-_feed.xml";
    feednami.load(url,function(result){
        if(result.error) {
            console.log(result.error);
        } else {
            var entries = result.feed.entries;
            //console.dir(entries);
            for(var i = 0; i < entries.length; i++){
                var entry = entries[i];
                //console.dir(entry);
                //make a article div and write it to container
                document.getElementById("retrieverFeed").innerHTML +=
                    "<a class='feedEntryLink' href='" + entry.guid + "' target='_blank'>" + "<div class='feedEntry'><h4>" + entry.title + "</h4>" +
                    "<h5>" + entry.summary + "</h5>" +
                    "<h5 class='float-right author'>" + entry.author + " (" + entry.date.substring(8,10) + "-" + entry.date.substring(5,7) + "-" + entry.date.substring(0,4) + ")</h5>" +
                    "</div></a>";

            }
        }
    });
}
*/
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


