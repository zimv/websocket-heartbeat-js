var wsHeartbeat;
describe('websocket-heartbeat-js', function() {
    it('onopen', function(done) {
        this.timeout(20000);
        wsHeartbeat = new WebsocketHeartbeatJs({
            url: 'ws://123.207.136.134:9010/ajaxchattest'
        });
        wsHeartbeat.onopen = function() {
            if (wsHeartbeat.repeat == 0) {
                done();
            }
            wsHeartbeat.onopen = function() {};
        };
    });

    it('onmessage', function(done) {
        this.timeout(20000);
        wsHeartbeat.send('send message');
        wsHeartbeat.onmessage = function(e) {
            //console.log(e);
            done();
            wsHeartbeat.onmessage = function() {};
        };
    });

    it('onclose && reconnect', function() {
        this.timeout(20000);
        var oncloseExecute = false;
        wsHeartbeat.onclose = function() {
            oncloseExecute = true;
        };
        var onreconnectExecute = false;
        wsHeartbeat.onreconnect = function() {
            onreconnectExecute = true;
        };
        wsHeartbeat.ws.onclose();
        chai.expect(onreconnectExecute).to.equal(true);
        chai.expect(oncloseExecute).to.equal(true);
    });

    it('manually close && forbid reconnect', function(done) {
        this.timeout(20000);
        var oncloseExecute = false;
        wsHeartbeat.onclose = function() {
            chai.expect(wsHeartbeat.forbidReconnect).to.equal(true);
            wsHeartbeat.onclose = function() {};
            done();
        };
        wsHeartbeat.close();
    });

    describe('reconnect test, wait 6~20 seconds, repeatLimit:4', function() {
        it('limit reconnect', function(done) {
            //travis maybe timeout
            this.timeout(90000);
            var wsHeartbeat2 = new WebsocketHeartbeatJs({
                //error address
                url: 'ws://123.207.167.163:9010',
                repeatLimit: 4
            });
            wsHeartbeat2.onreconnect = function() {
                if (wsHeartbeat2.repeat > 3) {
                    setTimeout(function() {
                        if (
                            wsHeartbeat2.repeat > 3 &&
                            wsHeartbeat2.repeat <= 4
                        ) {
                            done();
                        }
                    }, 8000);
                }
            };
        });
    });
    describe('reconnect test, wait 6~20 seconds, repeatLimit:default', function() {
        it('durative reconnect', function(done) {
            //travis maybe timeout
            this.timeout(90000);
            var wsHeartbeat2 = new WebsocketHeartbeatJs({
                //error address
                url: 'ws://123.207.167.163:9010'
            });
            wsHeartbeat2.onreconnect = function() {
                if (wsHeartbeat2.repeat > 5) {
                    wsHeartbeat2.close();
                    setTimeout(function() {
                        if (wsHeartbeat2.repeat > 5) {
                            done();
                        }
                    }, 8000);
                }
            };
        });
    });
});
