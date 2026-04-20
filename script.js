const form = document.getElementById('form');
const lista = document.getElementById('lista');
const search = document.getElementById('search');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const emptyState = document.getElementById('empty-state');
const countEl = document.getElementById('count');
const modal = document.getElementById('modal');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');

let contatos = JSON.parse(localStorage.getItem('contatos')) || [];
let editIndex = null;
let deleteIndex = null;

function salvarLocal() {
  localStorage.setItem('contatos', JSON.stringify(contatos));
}

// Retorna os contatos filtrados junto com o índice original no array
function getContatosFiltrados() {
  const filtro = search.value.toLowerCase();
  return contatos
    .map((c, index) => ({ ...c, originalIndex: index }))
    .filter(c =>
      c.nome.toLowerCase().includes(filtro) ||
      c.email.toLowerCase().includes(filtro)
    );
}

function render() {
  lista.innerHTML = '';

  const filtrados = getContatosFiltrados();

  if (filtrados.length === 0) {
    emptyState.style.display = 'block';
    lista.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    lista.style.display = 'flex';
  }

  countEl.textContent = `${filtrados.length} contato${filtrados.length !== 1 ? 's' : ''}`;

  filtrados.forEach(contato => {
    const li = document.createElement('li');
    const isEditing = contato.originalIndex === editIndex;

    if (isEditing) li.classList.add('editing');

    li.innerHTML = `
      <div class="contact-info">
        <strong>${contato.nome}</strong>
        <span>${contato.email}</span>
      </div>
      <div class="actions">
        <button class="btn-edit" onclick="editar(${contato.originalIndex})">
          ${isEditing ? 'Editando...' : 'Editar'}
        </button>
        <button class="btn-delete" onclick="confirmarDeletar(${contato.originalIndex})">Excluir</button>
      </div>
    `;

    lista.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  if (editIndex !== null) {
    contatos[editIndex] = { nome, email };
    cancelarEdicao();
  } else {
    contatos.push({ nome, email });
  }

  salvarLocal();
  render();
  form.reset();
});

function editar(index) {
  const contato = contatos[index];
  document.getElementById('nome').value = contato.nome;
  document.getElementById('email').value = contato.email;
  editIndex = index;

  saveBtn.textContent = 'Atualizar contato';
  cancelBtn.style.display = 'block';

  document.getElementById('nome').focus();
  render();
}

function cancelarEdicao() {
  editIndex = null;
  form.reset();
  saveBtn.textContent = 'Salvar contato';
  cancelBtn.style.display = 'none';
  render();
}

cancelBtn.addEventListener('click', cancelarEdicao);

// Modal de confirmação de exclusão
function confirmarDeletar(index) {
  deleteIndex = index;
  modal.style.display = 'flex';
}

modalConfirm.addEventListener('click', () => {
  if (deleteIndex !== null) {
    contatos.splice(deleteIndex, 1);
    salvarLocal();
    deleteIndex = null;

    if (editIndex !== null) cancelarEdicao();
    else render();
  }
  modal.style.display = 'none';
});

modalCancel.addEventListener('click', () => {
  deleteIndex = null;
  modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    deleteIndex = null;
    modal.style.display = 'none';
  }
});

search.addEventListener('input', render);

render();
