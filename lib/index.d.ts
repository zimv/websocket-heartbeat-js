declare module 'websocket-heartbeat-js' {
  class WebsocketHeartbeatJs {
    opts: {
      url: string
      protocols: string | string[]
      pingTimeout: number
      pongTimeout: number
      reconnectTimeout: number
      pingMsg: any
      repeatLimit: null | number
    }
    ws: WebSocket
    repeat: number
    onclose (): void
    onerror (): void
    onopen (): void
    onmessage (event: MessageEvent): void
    onreconnect (): void

    constructor (opts: {
      url: string
      protocols?: string | string[]
      pingTimeout?: number
      pongTimeout?: number
      reconnectTimeout?: number
      pingMsg?: any
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
