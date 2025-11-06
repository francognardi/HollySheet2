let characters = {};

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

function deleteCharacter(id) {
    delete characters[id];
    saveToStorage();
}

function loadCharacters() {
    loadFromStorage();
    return characters;
}