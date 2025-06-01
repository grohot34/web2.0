class Modal {
  constructor(title, content, imageSrc, size, bgColor = '#ffffff') {
    this.title = title;
    this.content = content;
    this.imageSrc = imageSrc;
    this.size = size;
    this.bgColor = bgColor;
  }

  createDOMElement(buttonText, index) {
    const overlay = document.getElementById('overlay');
    const modalState = () => ({
      title: this.title,
      content: this.content,
      imageSrc: this.imageSrc,
      size: this.size,
      bgColor: this.bgColor,
    });

    const show = () => {
      const state = modalState();
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.style.width = state.size;
      modal.style.background = state.bgColor;

      modal.innerHTML = `
        <h2>${state.title}</h2>
        <img src="${state.imageSrc}" alt="Изображение" style="width: ${state.size}; height: auto;">
        <p>${state.content}</p>
        <button id="close-btn">Закрыть</button>
      `;

      document.body.appendChild(modal);
      overlay.style.display = 'block';
      modal.classList.add('show');

      document.getElementById('close-btn').onclick = () => {
        modal.remove();
        overlay.style.display = 'none';
      };
    };

    const button = document.createElement('button');
    button.textContent = buttonText;
    button.dataset.index = index;

    const boundShow = show.bind(this);
    button.addEventListener('click', boundShow);

    return button;
  }

  update(newProps) {
    Object.assign(this, newProps);
  }
}

const modals = [];
let db;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ModalsDB", 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("modals")) {
        db.createObjectStore("modals", { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

function saveAllModals() {
  const tx = db.transaction("modals", "readwrite");
  const store = tx.objectStore("modals");
  store.clear();
  modals.forEach((m, i) => {
    store.add({ id: i, ...m });
  });
}

function loadModalsFromDB() {
  const tx = db.transaction("modals", "readonly");
  const store = tx.objectStore("modals");
  const request = store.getAll();
  request.onsuccess = () => {
    request.result.forEach(obj => {
      const modal = new Modal(obj.title, obj.content, obj.imageSrc, obj.size, obj.bgColor);
      modals.push(modal);
    });
    renderButtons();
  };
}

function updateModalIndexSelect() {
  const select = document.getElementById('modal-index-select');
  select.innerHTML = '';
  modals.forEach((modal, i) => {
    const option = document.createElement('option');
    option.value = i;
    const title = modal.title && modal.title.trim() !== '' ? modal.title : `Окно ${i + 1}`;
    option.textContent = title;
    select.appendChild(option);
  });
}

function renderButtons() {
  const container = document.getElementById('buttons-container');
  container.innerHTML = '';
  modals.forEach((modal, i) => {
    const button = modal.createDOMElement(modal.title, i);
    container.appendChild(button);
  });
  updateModalIndexSelect();
  saveAllModals();
}

document.getElementById('create-modal-btn').addEventListener('click', () => {
  const size = document.getElementById('size-select').value;
  const title = document.getElementById('title-select').value;
  const img = document.getElementById('img-select').value;
  const buttonText = document.getElementById('button-text-select').value;
  const content = document.getElementById('content-select').value;
  const bgColor = document.getElementById('bgcolor-select')?.value || '#ffffff';

  const modal = new Modal(title, content, img, size, bgColor);
  modals.push(modal);
  renderButtons();

  document.getElementById('title-select').selectedIndex = 0;
  document.getElementById('img-select').selectedIndex = 0;
  document.getElementById('button-text-select').selectedIndex = 0;
  document.getElementById('content-select').selectedIndex = 0;
  document.getElementById('size-select').selectedIndex = 0;
  document.getElementById('bgcolor-select').selectedIndex = 0;
});

document.getElementById('edit-modal-btn').addEventListener('click', () => {
  if (modals.length === 0) {
    showCustomAlert("Сначала создайте хотя бы одно окно!");
    return;
  }

  const index = +document.getElementById('modal-index-select').value;
  const newTitle = document.getElementById('new-title').value;
  const newContent = document.getElementById('new-content').value;
  const newImg = document.getElementById('new-img').value;

  if (modals[index]) {
    const updates = {};
    if (newTitle) updates.title = newTitle;
    if (newContent) updates.content = newContent;
    if (newImg) updates.imageSrc = newImg;

    modals[index].update(updates);

    document.getElementById('new-title').value = '';
    document.getElementById('new-content').value = '';
    document.getElementById('new-img').value = '';

    showCustomAlert(`Окно ${modals[index].title} обновлено!`);
    renderButtons();
  }
});

document.getElementById('delete-modal-btn')?.addEventListener('click', async () => {
  const index = +document.getElementById('modal-index-select').value;
  const modal = modals[index];

  if (modal) {
    const confirmed = await showCustomConfirm(`Вы уверены, что хотите удалить окно с заголовком "${modal.title}"?`);
    if (confirmed) {
      modals.splice(index, 1);
      showCustomAlert(`Окно "${modal.title}" удалено!`);
      renderButtons();
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => modal.remove());
    document.getElementById('overlay').style.display = 'none';
  }
});

document.getElementById('overlay').addEventListener('click', () => {
  document.querySelectorAll('.modal').forEach(modal => modal.remove());
  document.getElementById('overlay').style.display = 'none';
});

function showCustomAlert(message, title = "Уведомление") {
  const overlay = document.getElementById('overlay');
  const alertBox = document.getElementById('custom-alert');
  document.getElementById('custom-alert-title').textContent = title;
  document.getElementById('custom-alert-text').textContent = message;

  alertBox.classList.add('show');
  overlay.style.display = 'block';
}

function closeCustomAlert() {
  const overlay = document.getElementById('overlay');
  const alertBox = document.getElementById('custom-alert');
  alertBox.classList.remove('show');
  overlay.style.display = 'none';
}

function showCustomConfirm(message, title = "Подтверждение") {
  return new Promise((resolve) => {
    const overlay = document.getElementById('overlay');
    const dialog = document.getElementById('custom-confirm');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;

    dialog.classList.add('show');
    overlay.style.display = 'block';

    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');

    const cleanup = () => {
      dialog.classList.remove('show');
      overlay.style.display = 'none';
      yesBtn.onclick = null;
      noBtn.onclick = null;
    };

    yesBtn.onclick = () => {
      cleanup();
      resolve(true);
    };
    noBtn.onclick = () => {
      cleanup();
      resolve(false);
    };
  });
}

openDB().then(() => loadModalsFromDB());
