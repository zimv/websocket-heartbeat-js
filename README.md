<a href="https://www.npmjs.com/package/websocket-heartbeat-js" alt="NPM latest version"><img src="https://img.shields.io/npm/v/websocket-heartbeat-js.svg"></a>
<a href="https://npms.io/search?q=websocket-heartbeat-js" alt="NPM latest version"><img src="https://badges.npms.io/websocket-heartbeat-js.svg"></a>
<a href="https://deepscan.io/dashboard/#view=project&pid=3358&bid=29734"><img src="https://deepscan.io/api/projects/3358/branches/29734/badge/grade.svg" alt="DeepScan Grade"></a>
<a href="https://www.npmjs.com/package/websocket-heartbeat-js" alt="NPM total downloads"><img src="https://img.shields.io/npm/dt/websocket-heartbeat-js.svg"></a>
<a href="https://github.com/zimv/websocket-heartbeat-js" alt="Github stars"><img src="https://img.shields.io/github/stars/zimv/websocket-heartbeat-js.svg?style=social&label=Star"></a>
<a href="https://github.com/zimv/websocket-heartbeat-js" alt="Github forks"><img src="https://img.shields.io/github/forks/zimv/websocket-heartbeat-js.svg?style=social&label=Fork"></a>
<a href="https://github.com/zimv/websocket-heartbeat-js" alt="Github contributors"><img src="https://img.shields.io/github/contributors/zimv/websocket-heartbeat-js.svg"></a>
# websocket-heartbeat-js [(中文版README)][1]

---
## Introduction
The websocket-heartbeat-js is base on **WebSocket** of browser javascript, whose main purpose is to ensure web client and server connection, and it has a mechanism of heartbeat detection and automatic reconnection. When client device has network outage or server error which causes **websocket** to disconnect, the program will automatically reconnect until reconnecting is successful again.

## Why
When we use the native **websocket**, if network disconnects, any event function not be executed. So front-end program doesn't know that **websocket** was disconnected. But if program is now executing ***WebSocket.send()***, browser must discover that message signal is failed, so the onclose function will execute.


Back-end **websocket** service is likely to happen error, when **websocket** disconnected that front-end not notice message received. So need to send ping message by timeout. Server return pong message to client when server received ping message. Because received pong message, client know connection normal. If client not received pong message, it is connection abnormal, client will reconnect.

In summary, for solve above two problems. Client should initiative send ping message for check connect status.

## How

***1.close websocket connection***

If **websocket** need to disconnect, client must execute ***WebsocketHeartbeatJs.close()***. If server wants to disconnect, it should send a close message to client. When client received close message that it to execute ***WebsocketHeartbeatJs.close()***. 

**Example:**

    websocketHeartbeatJs.onmessage = (e) => {
        if(e.data == 'close') websocketHeartbeatJs.close();
    }

 
***2.ping & pong***

Server should to return pong message when the client sends a ping message. Pong message can be of any value. websocket-heartbeat-js will not handle pong message, instead it will only reset heartbeat after receiving any message, as receiving any message means that the connection is normal.

 
## Usage
### install
    npm install websocket-heartbeat-js

### import

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

#### use script

    <script src="./node_modules/websocket-heartbeat-js/dist/index.js"></script>
    let websocketHeartbeatJs = new window.WebsocketHeartbeatJs({
        url: 'ws://xxxxxxx'
    });

## API
### websocketHeartbeatJs.ws (WebSocket)
This ***websocketHeartbeatJs.ws*** is native **Websocket** instance. If you need more native **Websocket** features, operate the ***websocketHeartbeatJs.ws***.

    websocketHeartbeatJs.ws == WebSocket(websocketHeartbeatJs.opts.url);

### websocketHeartbeatJs.opts (Object)
    
| Attribute | required | type | default | description |
| ------ | ------ | ------ | ------ | ------ |
| url | true | string | none | websocket service address |
| protocols | false | string or string[] | none | new WebSocket(, protocols)|
| pingTimeout | false | number | 15000 | A heartbeat is sent every 15 seconds. If any backend message is received, the timer will reset |
| pongTimeout | false | number | 10000 | After the Ping message is sent, the connection will be disconnected without receiving the backend message within 10 seconds |
| reconnectTimeout | false | number | 2000 | The interval of reconnection |
| pingMsg | false | any | "heartbeat" / ()=>"heartbeat"| Ping message value |
| repeatLimit | false | number | null | The trial times of reconnection。default: unlimited |


    const options = {
        url: 'ws://xxxx',
        pingTimeout: 15000, 
        pongTimeout: 10000, 
        reconnectTimeout: 2000,
        pingMsg: "heartbeat"
    }
    let websocketHeartbeatJs = new WebsocketHeartbeatJs(options);

### websocketHeartbeatJs.send(msg) (function)
Send the message to the back-end service

    websocketHeartbeatJs.send('hello server');

### websocketHeartbeatJs.close() (function)
The front end manually disconnects the websocket connection. This method does not trigger reconnection.

### hook function and event function
#### websocketHeartbeatJs.onclose (function)

    websocketHeartbeatJs.onclose = (e) => {
        console.log('connect close');
    }

#### websocketHeartbeatJs.onerror (function)

    websocketHeartbeatJs.onerror = (e) => {
        console.log('connect onerror');
    }

#### websocketHeartbeatJs.onopen (function)

    websocketHeartbeatJs.onopen = (e) => {
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


## blog
[初探和实现websocket心跳重连][3]



## similar package
[websocket-heartbeat-miniprogram][4]


  [1]: https://github.com/zimv/websocket-heartbeat-js/blob/master/README-zh.md
  [2]: http://htmlpreview.github.io/?https://github.com/zimv/websocket-heartbeat-js/blob/master/demo/index.html
  [3]: http://www.cnblogs.com/1wen/p/5808276.html
  [4]: https://github.com/zimv/websocket-heartbeat-miniprogram