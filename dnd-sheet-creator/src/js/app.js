let characters = {};

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'listPage') {
        loadCharacters();
    }
}

function calculateModifier(score) {
    return Math.floor((score - 10) / 2);
}

function updateAttribute(attr, value) {
    document.getElementById(attr + 'Value').textContent = value;
    const mod = calculateModifier(parseInt(value));
    const modText = mod >= 0 ? '+' + mod : mod;
    document.getElementById(attr + 'Mod').textContent = modText;
}

document.getElementById('characterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const character = {
        name: document.getElementById('charName').value,
        race: document.getElementById('charRace').value,
        class: document.getElementById('charClass').value,
        background: document.getElementById('charBackground').value,
        attributes: {
            strength: parseInt(document.getElementById('strength').value),
            dexterity: parseInt(document.getElementById('dexterity').value),
            constitution: parseInt(document.getElementById('constitution').value),
            intelligence: parseInt(document.getElementById('intelligence').value),
            wisdom: parseInt(document.getElementById('wisdom').value),
            charisma: parseInt(document.getElementById('charisma').value)
        }
    };

    const id = Date.now().toString();
    characters[id] = character;
    saveToStorage();
    
    alert('✨ Ficha salva com sucesso!');
    this.reset();
    updateAttribute('str', 10);
    updateAttribute('dex', 10);
    updateAttribute('con', 10);
    updateAttribute('int', 10);
    updateAttribute('wis', 10);
    updateAttribute('cha', 10);
    
    showPage('listPage');
});

function saveToStorage() {
    const data = JSON.stringify(characters);
    document.cookie = 'dndCharacters=' + encodeURIComponent(data) + '; path=/; max-age=31536000';
}

function loadFromStorage() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'dndCharacters') {
            try {
                characters = JSON.parse(decodeURIComponent(value));
            } catch (e) {
                characters = {};
            }
            return;
        }
    }
    characters = {};
}

function loadCharacters() {
    loadFromStorage();
    const container = document.getElementById('charactersList');
    
    if (Object.keys(characters).length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhuma ficha criada ainda.<br>Comece sua aventura criando seu primeiro personagem!</div>';
        return;
    }

    container.innerHTML = '';
    
    for (let id in characters) {
        const char = characters[id];
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <div class="character-name">${char.name}</div>
            <div class="character-info"><span class="info-label">Raça:</span> ${char.race}</div>
            <div class="character-info"><span class="info-label">Classe:</span> ${char.class}</div>
            <div class="character-info"><span class="info-label">Antecedente:</span> ${char.background}</div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #8b4513;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.9em;">
                    <div><strong>FOR:</strong> ${char.attributes.strength}</div>
                    <div><strong>DES:</strong> ${char.attributes.dexterity}</div>
                    <div><strong>CON:</strong> ${char.attributes.constitution}</div>
                    <div><strong>INT:</strong> ${char.attributes.intelligence}</div>
                    <div><strong>SAB:</strong> ${char.attributes.wisdom}</div>
                    <div><strong>CAR:</strong> ${char.attributes.charisma}</div>
                </div>
            </div>
            <button class="btn delete-btn" onclick="deleteCharacter('${id}')">🗑️ Excluir</button>
        `;
        container.appendChild(card);
    }
}

function deleteCharacter(id) {
    if (confirm('Tem certeza que deseja excluir esta ficha?')) {
        delete characters[id];
        saveToStorage();
        loadCharacters();
    }
}

loadFromStorage();