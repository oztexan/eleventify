const fs = require('fs');
const cp = require('./ChordProGrammar')

const song = fs.readFileSync(process.argv[2]).toString();
const result = cp(song);
console.log(JSON.stringify(result, null, 2));
