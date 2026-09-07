import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserNotification } from '../models/notification.model';
import { API } from '../../../core/config/api-endpoints';
import { WS_ENDPOINT, WS_TOPICS } from '../../../core/config/api-websockets';

declare const SockJS: new (url: string) => unknown;
declare const Stomp: {
  over: (socket: unknown) => StompClient;
};

interface StompClient {
  connect: (headers: object, callback: (frame: unknown) => void) => void;
  subscribe: (destination: string, callback: (msg: { body: string }) => void) => void;
  disconnect: (callback?: () => void) => void;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private stompClient: StompClient | null = null;

  constructor(private readonly http: HttpClient) {}

  /**
   * Carica tutte le notifiche non lette dell'utente autenticato,
   * qualunque sia il suo ruolo — l'endpoint è già generico.
   */
  getAll(): Observable<UserNotification[]> {
    return this.http.get<UserNotification[]>(API.notification.read_all, { withCredentials: true });
  }

  markAsRead(id: number): Observable<void> {
    return this.http.post<void>(API.notification.notification + `/${id}/read`, null, { withCredentials: true });
  }

  /**
   * Sottoscrive tutti i topic disponibili: ogni utente riceve solo gli
   * eventi effettivamente indirizzati a lui (convertAndSendToUser lato
   * backend), quindi non serve filtrare i topic per ruolo qui — un
   * admin semplicemente non riceverà mai un EXAM_OUTCOME, perché
   * nessun evento di quel tipo viene mai pubblicato con il suo username.
   */
  connectWebSocket(onMessage: (notification: UserNotification) => void): void {
    const socket = new SockJS(WS_ENDPOINT);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      const client = this.stompClient;
      if (!client) return;

      Object.values(WS_TOPICS).forEach(topic => {
        client.subscribe(topic, msg => {
          const data = JSON.parse(msg.body) as UserNotification;
          onMessage(data);
        });
      });
    });
  }

  disconnectWebSocket(): void {
    this.stompClient?.disconnect();
    this.stompClient = null;
  }
}
