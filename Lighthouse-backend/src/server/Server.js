import express from "express";
import cors from "cors";

export default class Server {
  #app;
  #host;
  #port;
  #router;
  #server;

  constructor(port, host, router) {
    this.#app = express();
    this.#port = process.env.PORT || port || 4000;
    this.#host = host || "0.0.0.0";
    this.#server = null;
    this.#router = router;
  }

  getApp = () => {
    return this.#app;
  };

  start() {
    this.#app.use(
      cors({
        origin: ["https://df-lighthouse.onrender.com","http://localhost:5173"],
      })
    );

    this.#app.use(express.json());

    // this.#app.use((req, res, next) => {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept"
    //   );
    //   next();
    // });

    this.#router.getRouter().forEach((router) => {
      this.#app.use(router.getRouteStartPoint(), router.getRouter());
    });

    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`Server is listening on http://${this.#host}:${this.#port}`);
    });
  }

  close() {
    this.#server?.close();
  }
}
