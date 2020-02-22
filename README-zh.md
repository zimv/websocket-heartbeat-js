[![Build Status](https://travis-ci.org/zimv/websocket-heartbeat-js.svg?branch=master)](https://travis-ci.org/zimv/websocket-heartbeat-js)
<a href="https://www.npmjs.com/package/websocket-heartbeat-js" alt="NPM latest version"><img src="https://img.shields.io/npm/v/websocket-heartbeat-js.svg"></a>
<a href="https://npms.io/search?q=websocket-heartbeat-js" alt="NPM latest version"><img src="https://badges.npms.io/websocket-heartbeat-js.svg"></a>
<a href="https://deepscan.io/dashboard/#view=project&pid=3358&bid=29734"><img src="https://deepscan.io/api/projects/3358/branches/29734/badge/grade.svg" alt="DeepScan Grade"></a>
<a href="https://www.npmjs.com/package/websocket-heartbeat-js" alt="NPM total downloads"><img src="https://img.shields.io/npm/dt/websocket-heartbeat-js.svg"></a>
<a href="https://github.com/zimv/websocket-heartbeat-js" alt="Github stars"><img src="https://img.shields.io/github/stars/zimv/websocket-heartbeat-js.svg?style=social&label=Star"></a>
<a href="https://github.com/zimv/websocket-heartbeat-js" alt="Github forks"><img src="https://img.shields.io/github/forks/zimv/websocket-heartbeat-js.svg?style=social&label=Fork"></a>
<a href="https://github.com/zimv/websocket-heartbeat-js" alt="Github contributors"><img src="https://img.shields.io/github/contributors/zimv/websocket-heartbeat-js.svg"></a>
# websocket-heartbeat-js [(英文版README)][1]

---
## 介绍
websocket-heartbeat-js基于浏览器js原生websocket封装，主要目的是保障客户端websocket与服务端连接状态。该程序有心跳检测及自动重连机制，当网络断开或者后端服务问题造成客户端websocket断开，程序会自动尝试重新连接直到再次连接成功。
## 原理
在使用原生websocket的时候，如果设备网络断开，不会触发任何函数，前端程序无法得知当前连接已经断开。这个时候如果调用websocket.send方法，浏览器就会发现消息发不出去，便会立刻或者一定短时间后（不同浏览器或者浏览器版本可能表现不同）触发onclose函数。

后端websocket服务也可能出现异常，连接断开后前端也并没有收到通知，因此需要前端定时发送心跳消息ping，后端收到ping类型的消息，立马返回pong消息，告知前端连接正常。如果一定时间没收到pong消息，就说明连接不正常，前端便会执行重连。

为了解决以上两个问题，以前端作为主动方，定时发送ping消息，用于检测网络和前后端连接问题。一旦发现异常，前端持续执行重连逻辑，直到重连成功。
## 约定

***1.关闭websocket连接***

 如果需要断开websocket，应该执行WebsocketHeartbeatJs.close()，WebsocketHeartbeatJs.ws是原生Websocket实例对象，WebsocketHeartbeatJs.ws.onclose，已经被绑定了重连方法，如果后端websocket服务直接关闭连接，前端WebsocketHeartbeatJs.ws.onclose会被执行，WebsocketHeartbeatJs会尝试重连。如果后端想告诉前端需要断开连接，需要发送特定消息给前端，前端收到特定消息，调用WebsocketHeartbeatJs.close()，WebsocketHeartbeatJs将不会重连。
 
 

    websocketHeartbeatJs.onmessage = (e) => {
        if(e.data == 'close') websocketHeartbeatJs.close();
    }

 
***2.ping & pong***

 前端发送ping消息，后端收到后，需要立刻返回pong消息，pong消息可以是任何值，websocket-heartbeat-js并不处理pong消息，而只是在收到任何消息后，重置心跳，因为收到任何消息就说明连接是正常的。

 
## 用法
### 安装
    npm install websocket-heartbeat-js

### 引入使用

    import WebsocketHeartbeatJs from 'websocket-heartbeat-js';
    let websocketHeartbeatJs = new WebsocketHeartbeatJs({
        url: 'ws://xxxxxxx'
    });
    websocketHeartbeatJs.onopen = function () {
        console.log('connect success');
        websocketHeartbeatJs.send('hello server');
    }
    websocketHeartbeatJs.onmessage = function (e) {
        console.log(`onmessage: ${e.data}`);
    }
    websocketHeartbeatJs.onreconnect = function () {
        console.log('reconnecting...');
    }

#### 或者

    <script src="./node_modules/websocket-heartbeat-js/dist/index.js"></script>
    let websocketHeartbeatJs = new window.WebsocketHeartbeatJs({
        url: 'ws://xxxxxxx'
    });

## API
### websocketHeartbeatJs.ws (WebSocket)
websocket-heartbeat-js仅仅是封装了心跳相关的钩子函数，websocketHeartbeatJs.ws是原生Websocket实例，如需要使用更多websocket特性，请直接操作websocketHeartbeatJs.ws。

    websocketHeartbeatJs.ws 等于 WebSocket(websocketHeartbeatJs.opts.url);

### websocketHeartbeatJs.opts (Object)
    
| 属性 | 必填 | 类型 | 默认值 | 描述 |
| ------ | ------ | ------ | ------ | ------ |
| url | true | string | none | websocket服务端接口地址 |
| pingTimeout | false | number | 15000 | 每隔15秒发送一次心跳，如果收到任何后端消息定时器将会重置 |
| pongTimeout | false | number | 10000 | ping消息发送之后，10秒内没收到后端消息便会认为连接断开 |
| reconnectTimeout | false | number | 2000 | 尝试重连的间隔时间 |
| pingMsg | false | string | "heartbeat" | ping消息值 |
| repeatLimit | false | number | null | 重连尝试次数。默认不限制 |


    const options = {
        url: 'ws://xxxx',
        pingTimeout: 15000, 
        pongTimeout: 10000, 
        reconnectTimeout: 2000,
        pingMsg: "heartbeat"
    }
    let websocketHeartbeatJs = new WebsocketHeartbeatJs(options);

### websocketHeartbeatJs.send(msg) (function)
发送消息给后端

    websocketHeartbeatJs.send('hello server');

### websocketHeartbeatJs.close() (function)
前端手动断开websocket连接，此方法不会触发重连。
websocketHeartbeatJs.close()

### 钩子函数和事件函数
#### websocketHeartbeatJs.onclose (function)

    websocketHeartbeatJs.onclose = () => {
        console.log('connect close');
    }

#### websocketHeartbeatJs.onerror (function)

    websocketHeartbeatJs.onerror = () => {
        console.log('connect onerror');
    }

#### websocketHeartbeatJs.onopen (function)

    websocketHeartbeatJs.onopen = () => {
        console.log('open success');
    }

#### websocketHeartbeatJs.onmessage (function)

    websocketHeartbeatJs.onmessage = (e) => {
        console.log('msg:', e.data);
    }

#### websocketHeartbeatJs.onreconnect (function)

    websocketHeartbeatJs.onreconnect = (e) => {
        console.log('reconnecting...');
    }

## demo
[demo show][2]


## 博客 
[初探和实现websocket心跳重连][3]

## 相关代码库
[websocket-heartbeat-miniprogram][4]

  [1]: https://github.com/zimv/websocket-heartbeat-js/blob/master/README.md
  [2]: http://htmlpreview.github.io/?https://github.com/zimv/websocket-heartbeat-js/blob/master/demo/index.html
  [3]: http://www.cnblogs.com/1wen/p/5808276.html
  [4]: https://github.com/zimv/websocket-heartbeat-miniprogram