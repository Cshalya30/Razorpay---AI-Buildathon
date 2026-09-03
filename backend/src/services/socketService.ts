import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

class SocketService {
  private io: SocketIOServer | null = null;

  public init(server: HttpServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on("connection", (socket) => {
      // Client connected to live retry feed
    });
  }

  public emitMandateUpdate(mandate: any, auditEntry?: any): void {
    if (this.io) {
      this.io.emit("mandate:update", { mandate, audit: auditEntry });
    }
  }

  public emitRetryScheduled(mandate: any, auditEntry?: any): void {
    if (this.io) {
      this.io.emit("retry:scheduled", { mandate, audit: auditEntry });
    }
  }

  public emitMandateRecovered(mandate: any, auditEntry?: any): void {
    if (this.io) {
      this.io.emit("mandate:recovered", { mandate, audit: auditEntry });
    }
  }

  public emitMandateEscalated(mandate: any, auditEntry?: any): void {
    if (this.io) {
      this.io.emit("mandate:escalated", { mandate, audit: auditEntry });
    }
  }
}

export const socketService = new SocketService();
