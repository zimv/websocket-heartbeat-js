var should = chai.should();
describe('websocket-heartbeat-js', function(){
    before('new WebSocket', function(){
        var wsHeartbeat = new WebsocketHeartbeatJs({
            url: 'ws://121.40.165.18:8800'
        });
    })
    // it("1加2等于3", function(){
    //     console.log(WebsocketHeartbeatJs);
    // });
    
    it("1加1等于2", function()
    {
        // var wsHeartbeat = new WebsocketHeartbeatJs({
        //     url: 'ws://121.40.165.18:8800'
        // });
        var sum = test(1, 2);
        should.equal(sum, 3);
    });

    // it("1加2等于3", function()
    // {
    //     var sum = add(1, 2);
    //     should.equal(sum, 3);
    // });
})