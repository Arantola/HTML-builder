const { createReadStream } = require('fs');
const { resolve } = require('path');
const { stdout } = process;

const stream = createReadStream(resolve(__dirname, 'text.txt'), 'utf-8');

let data = '';
stream.on('data', chunk => data += chunk);
stream.on('end', () => stdout.write(data));
stream.on('error', err => stdout.write('Error: ', err.message));