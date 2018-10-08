# websocket-heartbeat-js


# 文档未完待续，如需使用，请看demo代码，预览[demo show][1]
---

## 介绍
websocket-heartbeat-js基于浏览器js原生websocket封装，主要目的是保障客户端websocket与服务端连接状态。该程序有心跳检测及自动重连机制，当网络断开或者后端服务问题造成客户端websocket断开，程序会自动尝试重新连接直到再次连接成功。
## 原理
在使用原生websocket的时候，如果设备网络断开，不会触发任何函数，前端程序无法得知当前连接已经断开。这个时候如果调用websocket.send方法，浏览器就会发现消息发不出去，便会立刻或者一定短时间后（不同浏览器或者浏览器版本可能表现不同）触发onclose函数。

后端websocket服务也可能出现异常，连接断开后前端也并没有收到通知，因此需要前端定时发送心跳消息ping，后端收到ping类型的消息，立马返回pong消息，告知前端连接正常。如果一定时间没收到pong消息，就说明连接不正常，前端便会执行重连。

为了解决以上两个问题，以前端作为主动方，定时发送ping消息，用于检测网络和前后端连接问题。一旦发现异常，前端持续执行重连逻辑，直到重连成功。
## 约定

 1. ***关闭websocket连接***
如果需要断开websocket，应该执行WebsocketHeartbeatJs.close()，WebsocketHeartbeatJs.ws是原生Websocket实例对象，WebsocketHeartbeatJs.ws.onclose，已经被绑定了重连方法，如果后端websocket服务直接关闭连接，前端WebsocketHeartbeatJs.ws.onclose会被执行，WebsocketHeartbeatJs会尝试重连。如果后端想告诉前端需要断开连接，需要发送特定消息给前端，前端收到特定消息，调用WebsocketHeartbeatJs.close()，WebsocketHeartbeatJs将不会重连。
 2. ***ping & pong***
前端发送ping消息，后端收到后，需要立刻返回pong消息，pong消息可以是任何值，websocket-heartbeat-js并不处理pong消息，而只是在收到任何消息后，重置心跳，因为收到任何消息就说明连接是正常的。
## 用法
### install
    npm install websocket-heartbeat-js

### import

    import WebsocketHeartbeatJs from 'websocket-heartbeat-js';
    let websocketHeartbeatJs = new WebsocketHeartbeatJs({
        url: 'ws://xxxxxxx'
    });
### script tag

## API
### websocketHeartbeatJs.opts (Object)
    
| 属性 | 必填 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| url | true | string | none |
| pingTimeout | false | number | 15000 |
| pongTimeout | false | number | 10000 |
| reconnectTimeout | false | number | 2000 |
| pingMsg | false | string | "HeartBeat" |

    const options = {
        url: 'ws://xxxx',
        pingTimeout: 15000, 
        pongTimeout: 10000, 
        reconnectTimeout: 2000,
        pingMsg: "HeartBeat"
    }
    let websocketHeartbeatJs = new WebsocketHeartbeatJs(options);


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