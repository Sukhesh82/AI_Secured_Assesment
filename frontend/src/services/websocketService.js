import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect(onConnectCallback, onErrorCallback) {
    if (this.client && this.connected) {
      if (onConnectCallback) onConnectCallback();
      return;
    }

    const token = localStorage.getItem('jwt_token');
    const wsUrl = window.location.protocol === 'https:' 
      ? `https://${window.location.host}/ws` 
      : `http://${window.location.host}/ws`;

    const socket = new SockJS(`${wsUrl}?token=${token || ''}`);

    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      debug: (str) => {
        // console.log('[STOMP]', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      this.connected = true;
      if (onConnectCallback) onConnectCallback(frame);
    };

    this.client.onStompError = (frame) => {
      this.connected = false;
      if (onErrorCallback) onErrorCallback(frame);
    };

    this.client.onWebSocketClose = () => {
      this.connected = false;
    };

    this.client.activate();
  }

  subscribe(topic, onMessageReceived) {
    if (!this.client || !this.connected) {
      // Retry after connection
      setTimeout(() => this.subscribe(topic, onMessageReceived), 1000);
      return null;
    }

    const sub = this.client.subscribe(topic, (message) => {
      if (message.body) {
        try {
          const bodyJson = JSON.parse(message.body);
          onMessageReceived(bodyJson);
        } catch (e) {
          onMessageReceived(message.body);
        }
      }
    });

    this.subscriptions.set(topic, sub);
    return sub;
  }

  unsubscribe(topic) {
    if (this.subscriptions.has(topic)) {
      const sub = this.subscriptions.get(topic);
      if (sub) sub.unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  sendMalpracticeEvent(eventDto) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/malpractice',
        body: JSON.stringify(eventDto),
      });
    } else {
      // Fallback to REST API if WebSocket transient connection issue
      import('./api').then(({ default: api }) => {
        api.post('/monitoring/events', eventDto).catch(() => {});
      });
    }
  }

  sendVideoFrame(frameDto) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/video-frame',
        body: JSON.stringify(frameDto),
      });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      this.subscriptions.clear();
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
