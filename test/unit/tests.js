var wsHeartbeat;
describe('websocket-heartbeat-js', function(){

    it('onopen', function(done){
        this.timeout(4000);
        wsHeartbeat = new WebsocketHeartbeatJs({
            url: 'ws://123.207.167.163:9010/ajaxchattest'
        });
        wsHeartbeat.onopen = function(){
            done();
            wsHeartbeat.onopen = function(){}
        };
    });

    it('onmessage', function(done){
        this.timeout(4000);
        wsHeartbeat.send('send message');
        wsHeartbeat.onmessage = function(e){
            //console.log(e);
            done();
            wsHeartbeat.onmessage = function(){};
        };
    });

    it('onclose && reconnect', function(){
        this.timeout(4000);
        var oncloseExecute = false;
        wsHeartbeat.onclose = function(){
            oncloseExecute = true;
        };
        var onreconnectExecute = false;
        wsHeartbeat.onreconnect = function(){
            onreconnectExecute = true;
        };
        wsHeartbeat.ws.onclose();
        chai.expect(onreconnectExecute).to.equal(true);
        chai.expect(oncloseExecute).to.equal(true);
    });

    it('manually close && forbid reconnect', function(){
        this.timeout(4000);
        var oncloseExecute = false;
        wsHeartbeat.onclose = function(){
            oncloseExecute = true;
        };
        wsHeartbeat.close();
        chai.expect(oncloseExecute).to.equal(false);
        chai.expect(wsHeartbeat.forbidReconnect).to.equal(true);
        wsHeartbeat.onclose = function(){};
    });

    describe('reconnect test, wait 6~20 seconds', function(){
        it('durative reconnect', function(done){
            this.timeout(18000);
            var wsHeartbeat = new WebsocketHeartbeatJs({//error address
                url: 'ws://123.207.167.163:9010'
            });
            var times = 0;
            wsHeartbeat.onreconnect = function(){
                times++;
                if(times>3){
                    wsHeartbeat.close();
                    setTimeout(function(){
                        if(times >= 3){
                            done();
                        }
                    }, 4000);
                }
            };
        });
    });
})