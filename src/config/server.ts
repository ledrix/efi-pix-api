import cors from "cors";
import express from "express";
require("dotenv").config();
const dated = require("date-and-time");

const PORT: string | number = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.json());

var valorDoPix = 0;
var valorAux = 0;
var ticket = 1;

app.get("/consulta", async (req, res) => {
  if (valorDoPix > 0 && valorDoPix >= ticket) {
    valorAux = valorDoPix;
    valorDoPix = 0;
    //creditos
    var creditos = valorAux / ticket;
    creditos = Math.floor(creditos);
    var pulsos = creditos * ticket;
    var pulsosFormatados = ("0000" + pulsos).slice(-4);

    return res.status(200).json({ retorno: pulsosFormatados });
  } else {
    return res.status(200).json({ retorno: "0000" });
  }
});

app.post("/rota-recebimento", async (req, res) => {
  try {
    var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("ip");
    console.log(ip);
    var qy = req.query.hmac;
    console.log("query");
    console.log(qy);

    if (ip != "34.193.116.226") {
      return res.status(401).json({ unauthorized: "unauthorized" });
    }

    if (qy != "myhash1234" && qy != "myhash1234/pix") {
      return res.status(401).json({ unauthorized: "unauthorized" });
    }

    console.log("Novo chamada a essa rota detectada:");
    console.log(req.body);

    console.log("valor:");
    if (req.body.pix) {
      valorDoPix = req.body.pix[0].valor;
      console.log(req.body.pix[0].valor);
    }
  } catch (error) {
    console.error(error);
    return res.status(402).json({ error: "error: " + error });
  }
  return res.status(200).json({ ok: "ok" });
});

app.post("/rota-recebimento-teste", async (req, res) => {
  try {
    console.log("Novo pix detectado:");
    console.log(req.body);

    console.log("valor:");
    valorDoPix = req.body.valor;
    console.log(req.body.valor);
  } catch (error) {
    console.error(error);
    return res.status(402).json({ error: "error: " + error });
  }
  return res.status(200).json({ mensagem: "pix realizado com sucesso" });
});

//código escrito por Lucas Carvalho em meados de Junho de 2023...
//git push heroku main
app.listen(PORT, () => console.log(`localhost:${PORT}`));
