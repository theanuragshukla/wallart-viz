const { Server } = require("socket.io");

class SocketServer {
  static instance;
  io;

  constructor(server) {
    if (SocketServer.instance) {
      return SocketServer.instance;
    }
    
    this.io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          process.env.CLIENT_URL || "http://localhost:3000",
        ],
        credentials: true,
      },
    });
    this.setupSocketIO();
    SocketServer.instance = this;
  }

  setupSocketIO() {
    this.io.use((socket, next) => {
      try {
        // const cookies = socket.handshake.headers.cookie?.split("; ");
        // const token = cookies
        //   ?.find((cookie) => cookie.startsWith("token="))
        //   ?.split("=")[1];
        // if (!token) throw new Error("No token provided");
        // const decoded = jwt.verify(
        //   token,
        //   process.env.JWT_SECRET || ""
        // );
        // socket.user = decoded;
        socket.user = { uid: "admin" };
        next();
      } catch (error) {
        console.log("Unauthorized connection");
        return socket.disconnect();
      }
    });

    this.io.on("connection", (socket) => {
      console.log(`${socket.user.uid} connected`);
      socket.join(socket.user.uid);
      socket.on("disconnect", () => {
        console.log(`${socket.user.uid} disconnected`);
      });
    });
  }

  static getInstance(server) {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer(server);
    }
    return SocketServer.instance;
  }
}

class SocketIO {
  static getInstance(server) {
    return SocketServer.getInstance(server).io;
  }
}

module.exports = SocketIO;

