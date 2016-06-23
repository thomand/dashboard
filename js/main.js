/**
 * Created by thomasandersen on 20.06.2016.
 */
$(document).ready(function(){
    setInterval(getClock, 1000);
    //updateBrowsers();
    makeMap();
    makeDeviceChart();
    updateIntervalPercent();
    //updateCurrentVisitors();
    //updateMostPopularPages();




});

var context;
var d;
var str;
function getClock() {
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



function updateMostPopularPages(){
    $.ajax({
        url:"http://139.59.168.70/ew/visitors/risingStars",
        async:true,
        dataType: 'json',
        type:'get'
    }).done(function(data) {

        /*Change class of arrows depending on if the values have increased/decreased*/

        /*data = [
         {"id":"LastThirtyDays","value":0.1},
         {"id":"lastThreeHundredAndSixtyFiveDays", "value":-0.8},
         {"id":"last7days", "value": 0.5}
         ]*/

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
            document.getElementById("changeMonth").innerHTML = data[0].value;
            document.getElementById("changeYear").innerHTML = data[1].value;
            document.getElementById("changeWeek").innerHTML = data[2].value;

        /*Change class of arrows depending on if the values have increased/decreased*/

        /*data = [
            {"id":"LastThirtyDays","value":0.1},
            {"id":"lastThreeHundredAndSixtyFiveDays", "value":-0.8},
            {"id":"last7days", "value": 0.5}
        ]*/


    });
}

function updateCurrentVisitors() {

    var data = [
        {"id":"currentVisitors", "value":1236}
    ]

    document.getElementById("currentVisitors").innerHTML = data[0].value;
}

function updateBrowsers() {
    /*$.ajax({
        url:"http://139.59.168.70/ew/visitors/browsers",
        async:true,
        dataType: 'json',
        type:'get'
    }).done(function(data) {*/
        /*Update browser and percentage in updateBrowserTable(data) method*/

        var data = [
            {"id":"firefox", "value":13012},
            {"id":"chrome" , "value":2537},
            {"id":"ie", "value":899},
            {"id":"safari" , "value":431},
            {"id":"opera", "value":157}

        ]
        updateBrowserTable(data);

    /*});*/

}

function updateBrowserTable(data) {

    document.getElementById("firefox-num").innerHTML = data[0].value;
    document.getElementById("chrome-num").innerHTML = data[1].value;
    document.getElementById("ie-num").innerHTML = data[2].value;
    document.getElementById("safari-num").innerHTML = data[3].value;
    document.getElementById("opera-num").innerHTML = data[4].value;
    var sum = parseInt(data[0].value) + parseInt(data[1].value) + parseInt(data[2].value) + parseInt(data[3].value) + parseInt(data[4].value);

    document.getElementById("firefox-percent").innerHTML = calculatePercent(data[0].value,sum) + "%";
    document.getElementById("chrome-percent").innerHTML = calculatePercent(data[1].value,sum) + "%";
    document.getElementById("ie-percent").innerHTML = calculatePercent(data[2].value,sum) + "%";
    document.getElementById("safari-percent").innerHTML = calculatePercent(data[3].value,sum) + "%";
    document.getElementById("opera-percent").innerHTML = calculatePercent(data[4].value,sum) + "%";

}

function calculatePercent(part, total) {
    return (part/total*100).toFixed(1);
}

function updatePlatform() {
    $.ajax({
        url:"http://139.59.168.70/ew/visitors/platform",
        async:true,
        dataType: 'json',
        type:'get'
    }).done(function(data) {
        /*Update platform in makeDeviceChart() method*/
        /*Make sure API send color as well. Makes it easier!*/
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
                    value: 4447100},
                {   /*Østfold*/
                    id: "NO-01",
                    value: 626932},
                {   /*Oslo*/
                    id: "NO-03",
                    value: 5130632},
                {   /*Hedmark*/
                    id: "NO-04",
                    value: 2673400},
                {   /*Oppland*/
                    id: "NO-05",
                    value: 33871648},
                {   /*Buskerud*/
                    id: "NO-06",
                    value: 4301261},
                {   /*Vestfold*/
                    id: "NO-07",
                    value: 3405565},
                {   /*Telemark*/
                    id: "NO-08",
                    value: 783600},
                {   /*Aust-Agder*/
                    id: "NO-09",
                    value: 15982378},
                {   /*Vest-Adger*/
                    id: "NO-10",
                    value: 8186453},
                {   /*Rogaland*/
                    id: "NO-11",
                    value: 7211537},
                {   /*Hordaland*/
                    id: "NO-12",
                    value: 4293953},
                {   /*Sogn og fjordane*/
                    id: "NO-14",
                    value: 6080485},
                {   /*Møre og Romsdal*/
                    id: "NO-15",
                    value: 2926324},
                {   /*Sør-Trøndelag*/
                    id: "NO-16",
                    value: 26088418},
                {   /*Nord-Trøndelag*/
                    id: "NO-17",
                    value: 4041769},
                {   /*Nordland*/
                    id: "NO-18",
                    value: 4468976},
                {   /*Troms*/
                    id: "NO-19",
                    value: 6274923},
                {   /*Finnmark*/
                    id: "NO-20",
                    value: 17419293}]
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
            rollOverColor: "#555555",
            rollOverOutlineColor: "#FFFFFF",
            selectedOutlineColor: "#FFFFFF",
            selectedColor: "#f15135",
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
            "color": "#8BD22F"
        },
        {
            "device": "Smartphone",
            "visits": 1882,
            "color": "#F95372"
        },
        {
            "device": "Tablet",
            "visits": 711,
            "color": "#E7BA08"
        }
    ];

    AmCharts.ready(function () {
        // PIE CHART
        chart = new AmCharts.AmPieChart();

        // title of the chart
        //chart.addTitle("Visitors countries", 16);

        chart.dataProvider = chartData;
        chart.titleField = "device";
        chart.valueField = "visits";
        chart.colorField = "color";
        chart.sequencedAnimation = true;
        chart.startEffect = "elastic";
        chart.innerRadius = "30%";
        chart.startDuration = 2;
        chart.labelRadius = 15;
        chart.color = "white";
        chart.balloonText = "[[title]]<br><span style='font-size:14px;'><b>[[value]]</b> ([[percents]]%)</span>";
        // the following two lines makes the chart 3D
        chart.depth3D = 10;
        chart.angle = 15;
        //chart.labelsEnabled = false;
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


