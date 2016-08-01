from firebase import firebase

f = firebase.FirebaseApplication('https://dashbordntnu.firebaseio.com/ew/', None)

test = {
      "browsers" : {
        "Chrome" : {
          "name" : "Chrome",
          "numbers" : "1350",
          "percent" : "65.5",
          "timestamp" : "1467874642"
        },
        "Firefox" : {
          "name" : "Firefox",
          "numbers" : "563",
          "percent" : "10",
          "timestamp" : "1467874642"
        },
        "IE" : {
          "name" : "Internet Explorer",
          "numbers" : "500",
          "percent" : "22",
          "timestamp" : "1467874642"
        },
        "Opera" : {
          "name" : "Opera",
          "numbers" : "121",
          "percent" : "14.34",
          "timestamp" : "1467874642"
        },
        "Safari" : {
          "name" : "Safari",
          "numbers" : "562",
          "percent" : "33",
          "timestamp" : "1467874642"
        }
      },
      "heatmap" : {
        "Akershus" : {
          "id" : "NO-02",
          "value" : 24
        },
        "AustAgder" : {
          "id" : "NO-09",
          "value" : 25
        },
        "Buskerud" : {
          "id" : "NO-06",
          "value" : 7
        },
        "Finnmark" : {
          "id" : "NO-20",
          "value" : 12
        },
        "Hedmark" : {
          "id" : "NO-04",
          "value" : 13
        },
        "Hordaland" : {
          "id" : "NO-12",
          "value" : 27
        },
        "MoreOgRomsdal" : {
          "id" : "NO-15",
          "value" : 14
        },
        "NordTrondelag" : {
          "id" : "NO-17",
          "value" : 37
        },
        "Nordland" : {
          "id" : "NO-18",
          "value" : 31
        },
        "Oppland" : {
          "id" : "NO-05",
          "value" : 9
        },
        "Oslo" : {
          "id" : "NO-03",
          "value" : 23
        },
        "Ostfold" : {
          "id" : "NO-01",
          "value" : 31
        },
        "Rogaland" : {
          "id" : "NO-11",
          "value" : 41
        },
        "SognOgFjordane" : {
          "id" : "NO-14",
          "value" : 31
        },
        "SorTrondelag" : {
          "id" : "NO-16",
          "value" : 57
        },
        "Telemark" : {
          "id" : "NO-08",
          "value" : 6
        },
        "Troms" : {
          "id" : "NO-19",
          "value" : 27
        },
        "VestAgder" : {
          "id" : "NO-10",
          "value" : 33
        },
        "Vestfold" : {
          "id" : "NO-07",
          "value" : 13
        }
      },
      "platform" : {
        "computer" : {
          "color" : "#03A9FC",
          "device" : "PC",
          "visits" : "444249"
        },
        "smartphone" : {
          "color" : "#87CE37",
          "device" : "Phone",
          "visits" : "222152"
        },
        "tablet" : {
          "color" : "#F05576",
          "device" : "Tablet",
          "visits" : "43535"
        }
      },
      "popularPages" : {
        "leastPopular" : {
          "five" : "http://www.ntnu.no/studier/emnesok",
          "four" : "http://www.ntnu.no/kart",
          "one" : "http://www.ntnu.no/studier/mtkom/veiledning",
          "three" : "https://www.ntnu.no/parkering/gloshaugen",
          "two" : "https://www.ntnu.no/studentliv/trondheim"
        },
        "mostPopular" : {
          "five" : "http://www.ntnu.no/studier/emnesok",
          "four" : "http://www.ntnu.no/kart",
          "one" : "http://www.ntnu.no/studier/mtkom/veiledning",
          "three" : "https://www.ntnu.no/parkering/gloshaugen",
          "two" : "https://www.ntnu.no/studentliv/trondheim"
        }
      },
      "visitorCount" : {
        "current" : "2578",
        "lastMonth" : {
          "change" : "down",
          "percent" : "3.3"
        },
        "lastWeek" : {
          "change" : "up",
          "percent" : "5.6"
        },
        "lastYear" : {
          "change" : "up",
          "percent" : "13.9"
        }
      }
    }


snapshot = f.patch('visitors', test)