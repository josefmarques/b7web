const formTarefa = document.getElementById('form-tarefa');
const inputTarefa = document.getElementById('input-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');

async function carregarTarefas() {
  const resposta = await fetch('/api/tarefas');
  const tarefas = await resposta.json();
  renderizarLista(tarefas);
}

function renderizarLista(tarefas) {
  listaTarefas.innerHTML = '';

  if (tarefas.length === 0) {
    const mensagem = document.createElement('p');
    mensagem.className = 'lista-vazia';
    mensagem.textContent = 'Nenhuma tarefa adicionada.';
    listaTarefas.appendChild(mensagem);
    return;
  }

  tarefas.forEach(function (tarefa) {
    const item = document.createElement('li');
    item.className = 'item-tarefa';

    const texto = document.createElement('span');
    texto.className = 'texto-tarefa';
    texto.textContent = tarefa.texto;

    if (tarefa.concluida) {
      texto.classList.add('concluida');
    }

    const btnConcluir = document.createElement('button');
    btnConcluir.className = 'btn btn-concluir';
    btnConcluir.textContent = tarefa.concluida ? 'Desfazer' : 'Concluir';
    btnConcluir.addEventListener('click', function () {
      alternarConclusao(tarefa.id);
    });

    const btnDeletar = document.createElement('button');
    btnDeletar.className = 'btn btn-deletar';
    btnDeletar.textContent = 'Deletar';
    btnDeletar.addEventListener('click', function () {
      deletarTarefa(tarefa.id);
    });

    item.appendChild(texto);
    item.appendChild(btnConcluir);
    item.appendChild(btnDeletar);
    listaTarefas.appendChild(item);
  });
}

async function adicionarTarefa(texto) {
  const textoLimpo = texto.trim();

  if (textoLimpo === '') {
    return;
  }

  await fetch('/api/tarefas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto: textoLimpo })
  });

  await carregarTarefas();
}

async function alternarConclusao(id) {
  await fetch('/api/tarefas/' + id, { method: 'PUT' });
  await carregarTarefas();
}

async function deletarTarefa(id) {
  await fetch('/api/tarefas/' + id, { method: 'DELETE' });
  await carregarTarefas();
}

formTarefa.addEventListener('submit', async function (evento) {
  evento.preventDefault();
  await adicionarTarefa(inputTarefa.value);
  inputTarefa.value = '';
  inputTarefa.focus();
});

carregarTarefas();