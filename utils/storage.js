const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = path.join(os.homedir(), '.habrmnc-bankai');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Ensure the directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function load(){
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        if (!data.trim()) return [];
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function save(data){
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

module.exports = {load, save}