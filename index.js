import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./config/db.js"; 

import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import router from "./routes/router.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://eventory-teste.onrender.com"
  ],
  credentials: true
}));
app.use(cookieParser());

app.use("/api", router);

const PORT = process.env.PORT || 9000;

// Modificado para utilizar a conexão MySQL
db.getConnection()
  .then((connection) => {
    console.log("Connected to MySQL database.");

    // Adiciona o objeto de conexão ao contexto da aplicação para ser utilizado pelas rotas
    app.set("mysqlConnection", connection);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MySQL database: ${error}`);
  });
