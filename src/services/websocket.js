// src/services/websocket.js

class WebSocketService {
    constructor(url) {
      this.url = url;
      this.socket = null;
    }
  
    connect() {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this.socket = new WebSocket(this.url);
  
        this.socket.onopen = () => {
          console.log('WebSocket connected');
        };
  
        this.socket.onmessage = (event) => {
          console.log('WebSocket message received:', event);
        };
  
        this.socket.onclose = () => {
          console.log('WebSocket closed');
        };
  
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      }
    }
  
    send(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);
      } else {
        console.error('WebSocket is not open');
      }
    }
  
    close() {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  
    export default new WebSocketService('ws://10.0.4.53:4000');
//      export default new WebSocketService('ws://localhost:4000');
  