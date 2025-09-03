import express from "express";
import bodyParser from "body-parser";
import path from "path";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

// configurar API da OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static("public"));
app.use(bodyParser.json());

// rota de perguntas
app.post("/perguntar", async (req, res) => {
  try {
    const { pergunta } = req.body;

    const resposta = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: pergunta }],
    });

    res.json({ resposta: resposta.choices[0].message.content });
  } catch (erro) {
    console.error("Erro no servidor:", erro);
    res.status(500).json({ resposta: "⚠️ Erro no servidor, tente novamente." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
