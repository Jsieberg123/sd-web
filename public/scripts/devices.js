timers = [];
connection = null;

function connect(deviceId) {
    if (connection != null) {
        connection.close();
    }
    for (var i = 0; i < timers.length; i++) {
        clearInterval(timers[i]);
    }

    getDevice(deviceId);

    loadDisplay();
}

function getDevice(deviceId) {
    if (typeof(deviceId) === "undefined") {
        deviceId = localStorage.getItem("d");
    }
    device = null;
    for (var i = 0; i < devices.length; i++) {
        if (devices[i].id == deviceId) {
            device = devices[i];
        }
    }
    if (device == null) {
        device = devices[0];
    }
    $("#" + device.id).addClass("active");
    localStorage.setItem("d", device.id);
}

function makeConnection() {
    $("#spinner").show();
    $("#retry").hide();
    connected = false;

    var timer = setTimeout(function() {
        if (!connected) {
            $("#spinner").hide();
            $("#retry").show();
        }
        if (connected) {
            $("#spinner").hide();
        }
    }, 5000);


    responseHandlers = {};

    responseHandlers["resp-get-cards"] = function(cards) {
        for (key in cards) {
            console.log(cards);
            loadCard(cards[key]);
        }
    }

    connection = new WebSocket(url + "?topic=" + device.id);

    connection.onopen = function() {
        sendMessage("get-cards", "");
        $("#cards").html("");
    }

    connection.onmessage = function(e) {
        clearTimeout(timer);
        var message = JSON.parse(e.data);

        if (message.e in responseHandlers) {
            responseHandlers[message.e](message.p);
        }
    }
}

function loadDisplay() {
    $.get("scripts/device.html", function(data) {
        data = ejs.render(data, device);
        $("#display").html(data);
        $(".click").click(function() {
            var id = $(this).attr("id");
            $("." + id).submit();
        });
        makeConnection();
    });
}

function loadCard(card) {
    $.get("cards/" + card.display, function(data) {
        data = ejs.render(data, card)
        connected = true;
        $("#spinner").hide();
        $("#cards").append(data);
    });
}

function sendMessage(e, p) {
    message = JSON.stringify({ e: e, p: p });
    connection.send(message);
}

function safeInterval(call, delay) {
    var int = setInterval(call, delay);
    timers.push(int);
}