# websocket-heartbeat-js

#文档未完待续，如需使用，请看demo代码
---

## 介绍
websocket-heartbeat-js基于浏览器js原生websocket封装，主要目的是保障客户端websocket与服务端连接状态。该程序有心跳检测及自动重连机制，当网络问题或者后端服务问题造成客户端websocket断开，程序会自动尝试重新连接直到再次连接成功。

## 用法
### install
    npm install websocket-heartbeat-js

### import

    import WebsocketHeartbeatJs from 'websocket-heartbeat-js';
    let wsHeartbeat = new WebsocketHeartbeatJs({
        url: 'ws://xxxxxxx'
    });
### script tag
### 配置options 

    new WebsocketHeartbeatJs(options);
    Object
        url: 'ws://xxxx',           //must
        pingTimeout: 15000,         //default
        pongTimeout: 10000,         //default
        reconnectTimeout: 2000,     //default
        heartMsg: "HeartBeat"       //default

### hook function
    onclose
    onerror
    onopen
    onmessage
    onreconnect
## demo
[demo show][1]


## blog 
[初探和实现websocket心跳重连][2]


  [1]: http://htmlpreview.github.io/?https://github.com/zimv/websocket-heartbeat-js/blob/master/demo/index.html
  [2]: http://www.cnblogs.com/1wen/p/5808276.html