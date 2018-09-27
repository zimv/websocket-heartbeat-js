/**
 * `WebSocket` constructor.
 *
 * @param {Object} opts
 * {
 *  url                  websocket链接地址
 *  pingTimeout 未收到消息多少秒之后发送ping请求，默认15000毫秒
    pongTimeout  发送ping之后，未收到消息超时时间，默认10000毫秒
    reconnectTimeout
    heartMsg
 * }
 * @api public
 */

function WebSocket({
    url, 
    pingTimeout = 15000,
    pongTimeout = 10000,
    reconnectTimeout = 2000,
    heartMsg = "HeartBeat"
}){
    this.opts ={
        url: url,
        pingTimeout: pingTimeout,
        pongTimeout: pongTimeout,
        reconnectTimeout: reconnectTimeout,
        heartMsg: heartMsg
    }
    this.ws = null;//websocket实例

    //override hook function
    this.onclose = () => {};
    this.onerror = () => {};
    this.onopen = () => {};
    this.onmessage = () => {};

    this.createWebSocket();
}
WebSocket.prototype.createWebSocket = () => {
    try {
        this.ws = new WebSocket(this.opts.url);
        this.initEventHandle();
    } catch (e) {
        console.error(e);
        this.reconnect();
    }     
}

WebSocket.prototype.initEventHandle = () => {
    this.ws.onclose = function () {
        this.onclose();
        this.reconnect();
    };
    this.ws.onerror = function () {
        this.onerror();
        this.reconnect();
    };
    this.ws.onopen = function () {
        this.onopen();
        //心跳检测重置
        this.heartCheck();
    };
    this.ws.onmessage = (event) => {
        this.onmessage(event);
        //如果获取到消息，心跳检测重置
        //拿到任何消息都说明当前连接是正常的
        this.heartCheck();
    }
}

WebSocket.prototype.reconnect = () => {
    if(this.lockReconnect || this.forbidReconnect) return;
    this.lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
        this.createWebSocket();
        this.lockReconnect = false;
    }, this.opts.reconnectTimeout);
}

//心跳检测
WebSocket.prototype.heartCheck = () =>{
    this.heartReset();
    this.heartStart();
}
WebSocket.prototype.heartStart = () =>{
    this.pingTimeoutId = setTimeout(() => {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        //onmessage拿到返回的心跳就说明连接正常
        this.ws.send(this.opts.heartMsg);
        //如果超过一定时间还没重置，说明后端主动断开了
        this.pongTimeoutId = setTimeout(() => {
            //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            this.ws.close();
        }, this.opts.pongTimeout)
    }, this.opts.pingTimeout)
}
WebSocket.prototype.heartReset = () =>{
    clearTimeout(this.pingTimeoutId);
    clearTimeout(this.pongTimeoutId);
}
WebSocket.prototype.close = () =>{
    //如果手动关闭连接，不再重连
    this.forbidReconnect = true;
    this.ws.close();
}

module.exports = WebSocket;