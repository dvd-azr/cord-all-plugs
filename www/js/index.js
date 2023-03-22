/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    // StatusBar.hide();
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    /**
     * Pushe Config
     * */
    const pusher = new Pusher('local', {
        wsHost: window.location.hostname,
        // wsHost: '4664-2001-448a-50a0-a4aa-c10-bbf1-1c1e-7d6a.ngrok.io',
        // wssHost: '4664-2001-448a-50a0-a4aa-c10-bbf1-1c1e-7d6a.ngrok.io',
        wsPort: 6001,
        wssPort: 6001,
        scheme: 'http',
        useTLS: false,
        forceTLS: false,
        encrypted: false,
        // options: {
        //     useTLS: false,
        //     encrypted: false,
        //     // host : env('PUSHER_HOST'),
        //     // 'port' : env('PUSHER_PORT'),
        //     // // 'port' : 6001,
        //     scheme: 'http'
        // },
        // wssPort: 6001,
        // wsPath: this.app.path === null ? '' : this.app.path,
        auth: {
            headers: {
                // 'X-CSRF-Token': "{{ csrf_token() }}",
                'X-App-ID': "123local"
            }
        },
        disableStats: true,
        enabledTransports: ['ws']
    });
    // pusher.subscribe('testing.public.idSocket', function (e) {


    pusher.connection.bind('connected', () => {
        // this.connected = true;
        console.log('connected');

    });
    // Bind to the connection's state-change event
    // So we can update the UI based on the changes
    pusher.connection.bind('state_change', function (states) {
        console.log(states);
        // document.getElementById("pusher-event").innerHTML = states.current;
        var state = pusher.connection.state;
        console.log("connection state: " + state);
    });

    const PublicChannel = pusher.subscribe('testingPublicBroadcast');

    PublicChannel.bind('.testingPublicBroadcast', (data) => {
        // pusher.connection.bind('publicEventCoba', (data) => {
        console.log("dapat mase : testingPublicBroadcast");
        console.log(data);

    });

    // Also subscribe to a channel and bind to an event
    // Update the UI when a new message is received
    // var channel = pusher.subscribe('testingPublicBroadcast');
    var channel = pusher.subscribe('cordova');
    channel.bind('cordova-event', function (data) {
        // channel.bind('testing.public.idSocket', function (data) {
        document.getElementById("pusher-event").innerHTML = data.message;
        console.log(data);
    });

    // ==============================================================================================
    /**
     * Echo Config
     * */
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'local',
        cluster: 'mt1',
        // wsHost: '192.168.1.17',
        // wsHost: 'localhost',
        wsHost: '127.0.0.1',
        wsPort: 6001,
        wssPort: 6001,
        forceTLS: false,
        encrypted: false,
        scheme: 'http',
        enabledTransports: ['ws'],
        host: window.location.hostname,
        // statsHost: window.location.hostname,

        // enabledTransports: ['ws', 'wss']
    });

    // console.log(window.Echo);
    const Public = Echo.channel('testing.public.idSocket')
        .listen('.testingPublicBroadcast', (data) => {
            // const Public = Echo.channel('public.coba')
            // .listen('.publicEventCoba', (data) => {
            console.log(data);
            if (StatusBar.isVisible) {
                StatusBar.hide();
            }
            addElement();
        });
    console.log(Public);

    // Public.subscribed((e) => {
    //     console.log("subscribe oke");
    // }).listen('.testingPublicBroadcast', (e) => {
    //     console.log(e);
    // });

    function addElement() {
        const deviceready = document.getElementById('deviceready')
        deviceready.innerHTML += '<p class="event received">Device is Ready</p>';
        deviceready.classList.add('ready');
    }


}