var wsHeartbeat;
describe('websocket-heartbeat-js', function(){

    it("onopen", function(done){
        wsHeartbeat = new WebsocketHeartbeatJs({
            url: 'ws://121.40.165.18:8800'
        });
        wsHeartbeat.onopen = function(){
            done();
            wsHeartbeat.onopen = function(){}
        }
    });

    it("onmessage", function(done){
        wsHeartbeat.onmessage = function(e){
            //console.log(e);
            done();
            wsHeartbeat.onmessage = function(){}
        }
    });

    it("onclose && reconnect", function(){
        var oncloseExecute = false;
        wsHeartbeat.onclose = function(){
            oncloseExecute = true;
        }
        var onreconnectExecute = false;
        wsHeartbeat.onreconnect = function(){
            onreconnectExecute = true;
        }
        wsHeartbeat.ws.onclose();
        chai.expect(onreconnectExecute).to.equal(true);
        chai.expect(oncloseExecute).to.equal(true);
    });

    it("manually close && forbid reconnect", function(){
        var oncloseExecute = false;
        wsHeartbeat.onclose = function(){
            oncloseExecute = true;
        }
        wsHeartbeat.close();
        chai.expect(oncloseExecute).to.equal(false);
        chai.expect(wsHeartbeat.forbidReconnect).to.equal(true);
        wsHeartbeat.onclose = function(){}
    });

    it("durative reconnect", function(done){
        this.timeout(18000);
        var wsHeartbeat = new WebsocketHeartbeatJs({//error address
            url: 'ws://121.40.165.18:810'
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
                }, 4000)
            }
        }
    });
})