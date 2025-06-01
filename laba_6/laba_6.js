const colorsSet = new Set(['red', 'green', 'blue', 'purple', 'orange', 'teal', 'brown', 'gray']);
const textsSet = new Set([
  'Новости дня: Важные события сегодня', 
  'Специальное предложение: Скидки на авто', 
  'Технологии будущего: Влияние ИИ на повседневную жизнь', 
  'Экологические инициативы: Борьба с загрязнением', 
  'Глобальные изменения климата: Что нас ждет', 
  'Последние тренды в мире моды', 
  'Новые подходы в обучении: Дистанционное образование', 
  'Развитие городов: Умные города и их особенности'
]);

const colorSelect = document.getElementById('colorSelect');
const textSelect = document.getElementById('textSelect');

colorsSet.forEach(color => {
  const option = document.createElement('option');
  option.value = color;
  option.textContent = color;
  colorSelect.appendChild(option);
});

textsSet.forEach(text => {
  const option = document.createElement('option');
  option.value = text;
  option.textContent = text;
  textSelect.appendChild(option);
});

class BlockCreator {
  constructor() {
    this.color = 'gray';
    this.text = 'Параграф по умолчанию';
    this.width = '300px';
  }

  initWithColor(color) {
    this.color = color;
    this.text = 'Цветной блок';
    this.width = '300px';
  }

  initWithColorAndText(color, text) {
    this.color = color;
    this.text = text;
    this.width = '300px';
  }

  initWithColorTextAndWidth(color, text, width) {
    this.color = color;
    this.text = text;
    this.width = width;
  }

  setColor(color) { this.color = color; }
  setText(text) { this.text = text; }
  setWidth(width) { this.width = width; }

  createParagraph(text) {
    const p = document.createElement('p');
    p.textContent = text;
    return p;
  }

  render() {
    const outerDiv = document.createElement('div');
    outerDiv.className = 'child';
    outerDiv.style.backgroundColor = this.color;
    outerDiv.style.width = this.width;

    const child = document.createElement('div');
    const p1 = this.createParagraph(this.text);
    child.appendChild(p1);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ Удалить';
    deleteBtn.className = 'delete-btn';

    deleteBtn.onclick = async () => {
      outerDiv.classList.add('fade-out');
      setTimeout(() => outerDiv.remove(), 700);
      await removeBlock(outerDiv.dataset.dbId);
    };

    child.appendChild(deleteBtn);
    outerDiv.appendChild(child);

    return outerDiv;
  }
}

class AdvancedBlockCreator extends BlockCreator {
  constructor() {
    super();
  }
  createAdvancedBlock(parent) {
    const element = this.render();
    parent.appendChild(element);
  }
}

  let db;
  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("BlockDatabase", 1);
      request.onerror = () => reject("DB open error");
      request.onsuccess = () => {
        db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("blocks")) {
          const store = db.createObjectStore("blocks", { keyPath: "id", autoIncrement: true });
          store.createIndex("id", "id", { unique: true });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
      };
    });
  }

  function saveBlock(data) {
    return new Promise((resolve) => {
      const tx = db.transaction("blocks", "readwrite");
      const store = tx.objectStore("blocks");
      const request = store.add(data);
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }

  async function loadBlocks() {
    return new Promise((resolve) => {
      const tx = db.transaction("blocks", "readonly");
      const store = tx.objectStore("blocks");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });
  }

  function removeBlock(id) {
    return new Promise((resolve) => {
      const tx = db.transaction("blocks", "readwrite");
      const store = tx.objectStore("blocks");
      store.delete(Number(id));
      resolve();
    });
  }

  function removeAllBlocksFromDB() {
    const tx = db.transaction("blocks", "readwrite");
    const store = tx.objectStore("blocks");
    store.clear();
  }

  function saveBackgroundColor(color) {
    const tx = db.transaction("settings", "readwrite");
    const store = tx.objectStore("settings");
    store.put({ key: "background", value: color });
  }

  function loadBackgroundColor() {
    return new Promise((resolve) => {
      const tx = db.transaction("settings", "readonly");
      const store = tx.objectStore("settings");
      const request = store.get("background");
      request.onsuccess = () => resolve(request.result.value || '#ffffff');
    });
  }

  async function addBlock() {
    const color = colorSelect.value;
    const text = textSelect.value;
    const width = document.getElementById('widthSelect').value;
    const order = document.getElementById('orderSelect').value;
    const container = document.getElementById('parent');

    const block = new AdvancedBlockCreator();
    block.initWithColorTextAndWidth(color, text, width);
    const element = block.render();

    const position = (order === "last")
      ? container.children.length
      : parseInt(order);

    const blockData = { color, text, width, position };
    const dbId = await saveBlock(blockData);
    element.dataset.dbId = dbId;

    if (order === "last") {
      container.appendChild(element);
    } else {
      const index = parseInt(order);
      const referenceNode = container.children[index];
      container.insertBefore(element, referenceNode || null);
    }
  }

  function sortBlocks() {
    const container = document.getElementById('parent');
    const blocks = Array.from(container.children);
    blocks.sort((a, b) => a.style.backgroundColor.localeCompare(b.style.backgroundColor));
    blocks.forEach(block => container.appendChild(block));
  }

  function sortBlocksByText() {
    const container = document.getElementById('parent');
    const blocks = Array.from(container.children);
    blocks.sort((a, b) => {
      const textA = a.querySelector('div p').textContent;
      const textB = b.querySelector('div p').textContent;
      return textA.localeCompare(textB);
    });
    blocks.forEach(block => container.appendChild(block));
  }

  function removeAllBlocks() {
    const blocks = document.querySelectorAll('#parent .child');
    blocks.forEach(block => {
      block.classList.add('fade-out');
      setTimeout(() => block.remove(), 500);
    });
    removeAllBlocksFromDB();
  }

  document.getElementById('backgroundColor').addEventListener('input', (event) => {
    const color = event.target.value;
    document.getElementById('parent').style.backgroundColor = color;
    saveBackgroundColor(color);
  });

  window.onload = async () => {
    await openDB();
    const container = document.getElementById('parent');

    const savedColor = await loadBackgroundColor();
    container.style.backgroundColor = savedColor;
    document.getElementById('backgroundColor').value = savedColor;

    const savedBlocks = await loadBlocks();

    savedBlocks.forEach(data => {
      const block = new AdvancedBlockCreator();
      block.initWithColorTextAndWidth(data.color, data.text, data.width);
      const element = block.render();
      element.dataset.dbId = data.id;
      const position = data.position === "last" ? container.children.length : data.position;
      const referenceNode = container.children[position];
      container.insertBefore(element, referenceNode || null);
    });
  };