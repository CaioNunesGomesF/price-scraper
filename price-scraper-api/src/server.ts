import config from "./config/config.js";
import app from "./app.js";

app.listen(config.server.port, () => {
  console.log(`Servidor rodando na porta ${config.server.port}`);
});
