import cors from "cors";
import express from "express";
require("dotenv").config();
const dated = require("date-and-time");

const PORT: string | number = process.env.PORT || 5001;

const app = express();

app.use(cors());

app.use(express.json());

var valorPixMaquina1 = 0; //ZQy2tcerltlitYMS3VB1IM1
var valorPixMaquina2 = 0; //HXIxtQ9f4aFTuTZbDZntKM2

function converterPixRecebido(valorPix: number) {
  var valorAux = 0;
  var ticket = 1;
  if (valorPix > 0 && valorPix >= ticket) {
    valorAux = valorPix;
    valorPix = 0;
    //creditos
    var creditos = valorAux / ticket;
    creditos = Math.floor(creditos);
    var pulsos = creditos * ticket;
    var pulsosFormatados = ("0000" + pulsos).slice(-4);
    return pulsosFormatados;
  } else {
    return "0000";
  }
}

//ZQy2tcerltlitYMS3VB1IM1 << ALTERAR PARA O TXID DA MAQUINA
app.get("/query-kany-machine01", async (req, res) => {
  var pulsosFormatados = converterPixRecebido(valorPixMaquina1); //<<<<<<ALTERAR PARA O NUMERO DA MAQUINA

  valorPixMaquina1 = 0; //<<<<<<<<<ALTERAR PARA O NUMERO DA MAQUINA

  if (pulsosFormatados != "0000") {
    return res.status(200).json({ retorno: pulsosFormatados });
  } else {
    return res.status(200).json({ retorno: "0000" });
  }
});

//HXIxtQ9f4aFTuTZbDZntKM2 << ALTERAR PARA O TXID DA MAQUINA
app.get("/query-kany-machine02", async (req, res) => {
  var pulsosFormatados = converterPixRecebido(valorPixMaquina2); //<<<<<<ALTERAR PARA O NUMERO DA MAQUINA

  valorPixMaquina2 = 0; //<<<<<<<<<ALTERAR PARA O NUMERO DA MAQUINA

  if (pulsosFormatados != "0000") {
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

    console.log("valor do pix recebido:");
    console.log(req.body.pix[0].valor);

    if (req.body.pix) {
      if (req.body.pix[0].txid == "ZQy2tcerltlitYMS3VB1IM1") {
        valorPixMaquina1 = req.body.pix[0].valor;
        console.log("Creditando valor do pix na máquina 1");
      }

      if (req.body.pix[0].txid == "HXIxtQ9f4aFTuTZbDZntKM2") {
        valorPixMaquina2 = req.body.pix[0].valor;
        console.log("Creditando valor do pix na máquina 2");
      }
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

    // console.log("valor:");
    // console.log(req.body.valor);
    // console.log("txid:");
    // console.log(req.body.txid);

    var txid = req.body.txid;
    if (txid == "ZQy2tcerltlitYMS3VB1IM1") {
      valorPixMaquina1 = req.body.valor;
      console.log("Set pix value to machine 1:" + req.body.valor);
    }

    if (txid == "kHXIxtQ9f4aFTuTZbDZntKM2") {
      valorPixMaquina2 = req.body.valor;
      console.log("Set pix value to machine 2:");
    }

    console.log(req.body.valor);
  } catch (error) {
    console.error(error);
    return res.status(402).json({ error: "error: " + error });
  }
  return res.status(200).json({ mensagem: "ok" });
});

//código escrito por Raphael Fernando Oliveira...

app.listen(PORT, () => console.log(`localhost:${PORT}`));
