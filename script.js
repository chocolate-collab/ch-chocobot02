const chat = document.getElementById("chat");
const perguntaInput = document.getElementById("pergunta");
const enviarBtn = document.getElementById("enviar");
const novaConversaBtn = document.getElementById("novaConversa");
const listaHistorico = document.getElementById("listaHistorico");

let historico = [];
let conversaAtual = [];

function addMensagem(texto, classe) {
  const div = document.createElement("div");
  div.className = "msg " + classe;
  div.textContent = texto;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function enviarPergunta() {
  const pergunta = perguntaInput.value;
  if (!pergunta) return;

  addMensagem(pergunta, "user");
  conversaAtual.push({ role: "user", content: pergunta });
  perguntaInput.value = "";

  try {
    const resposta = await fetch("/perguntar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta })
    });

    const dados = await resposta.json();
    addMensagem(dados.resposta, "bot");
    conversaAtual.push({ role: "assistant", content: dados.resposta });
  } catch {
    addMensagem("⚠️ Erro ao conectar com o servidor.", "bot");
  }
}

enviarBtn.addEventListener("click", enviarPergunta);
perguntaInput.addEventListener("keypress", e => {
  if (e.key === "Enter") enviarPergunta();
});

novaConversaBtn.addEventListener("click", () => {
  if (conversaAtual.length > 0) {
    historico.push(conversaAtual);
    const item = document.createElement("li");
    item.textContent = "Conversa " + historico.length;
    item.onclick = () => carregarConversa(historico.length - 1);
    listaHistorico.appendChild(item);
  }
  conversaAtual = [];
  chat.innerHTML = "";
});

function carregarConversa(indice) {
  chat.innerHTML = "";
  conversaAtual = [...historico[indice]];
  conversaAtual.forEach(m => addMensagem(m.content, m.role === "user" ? "user" : "bot"));
}
