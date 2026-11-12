import {
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { env } from "@rumahkodingku-academy/env/server";
import type { Server, Socket } from "socket.io";

@WebSocketGateway({
  namespace: "notifications",
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    client.emit("notification.connected", { connected: true });
  }

  handleDisconnect(_client: Socket): void {
    // Connection cleanup is handled by Socket.io.
  }

  emitNotification(userId: string, payload: Record<string, unknown>): void {
    this.server.to(`user:${userId}`).emit("notification.created", payload);
  }
}
