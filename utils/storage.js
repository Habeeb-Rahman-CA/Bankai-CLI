const fs = require('fs');

const FILE = "data.json"

function load(){
    if (!fs.existsSync(FILE)) return [];
    const data = fs.readFileSync(FILE, 'utf-8');

    if (!data.trim()) return [];

    return JSON.parse(data);
}

function save(data){
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

module.exports = {load, save}