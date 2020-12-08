declare module 'websocket-heartbeat-js' {
  class WebsocketHeartbeatJs {
    opts: {
      url: string
      pingTimeout: number
      pongTimeout: number
      reconnectTimeout: number
      pingMsg: string
      repeatLimit: null | number
    }
    ws: WebSocket
    repeat: number
    onclose (): void
    onerror (): void
    onopen (): void
    onmessage (event: MessageEvent): void
    onreconnect (): void
    createWebSocket(): void

    constructor (opts: {
      url: string
      pingTimeout?: number
      pongTimeout?: number
      reconnectTimeout?: number
      pingMsg?: string
      repeatLimit?: number | null
    })

    createWebSocket (): void
    initEventHandle (): void
    reconnect (): void
    send(data: Parameters<WebSocket['send']>[0]): void
    heartCheck (): void
    heartStart (): void
    heartReset (): void
    close (): void
  }

  export default WebsocketHeartbeatJs
}
