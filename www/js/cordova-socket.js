document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {



    // console.log(device.cordova);

    // StatusBar.hide();
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');


    // var accessToken = "abcdefghiklmnopqrstuvwxyz";
    var wsOptions = {
        // Punya Pusher
        // url: "ws://192.168.1.10:6001/app/local?protocol=7&client=js&version=4.3.1&flash=false",

        // Manual
        url: "ws://127.0.0.1:6001/socket/update?appKey=local",
        // url: "ws://localhost:6001/socket/update?appKey=local",
        timeout: 5000,
        pingInterval: 10000,
        // headers: {
        //     "Authorization": "Bearer " + accessToken
        // },
        acceptAllCerts: false
    }
    try {
        CordovaWebsocketPlugin.wsConnect(wsOptions,
            function (recvEvent) {
                console.log("Received callback from WebSocket: " + recvEvent["callbackMethod"]);
                // console.log(recvEvent.message);
                // console.log(recvEvent.onMessage);
                console.log(recvEvent);
                if (recvEvent["callbackMethod"] === 'onMessage') {
                    console.log("on message");
                    addElement()
                }
            },
            function (success) {
                console.log("Connected to WebSocket with id: " + success.webSocketId);
                console.log(success);
                CordovaWebsocketPlugin.wsSend(success.webSocketId, JSON.stringify({
                    socket_id: success.webSocketId,
                    // payload: {
                    //     pusher: 'pusherMase',
                    //     event: 'CobaEvent',
                    //     title: 'abc123',
                    // },
                    event: "pusher:subscribe",
                    // event: "pusher:App\\Events\\CobaEvent",
                    // channel: "public.coba",
                    // key: 'local',
                    // secret: '123local',
                    data: {
                        channel: "public.coba",
                        "message": "dari Cordova fire CobaEvent",
                        "room_id": 1
                    }
                }));

            },
            function (error) {
                console.log("Failed to connect to WebSocket: " +
                    "code: " + error["code"] +
                    ", reason: " + error["reason"] +
                    ", exception: " + error["exception"]);
            }
        );

    } catch (error) {
        console.log(error);
    }

    function addElement() {
        const deviceready = document.getElementById('deviceready')
        deviceready.innerHTML += '<p class="event received">Device is Ready</p>';
        deviceready.classList.add('ready');
    }

}