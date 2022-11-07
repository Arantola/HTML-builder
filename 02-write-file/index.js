const { createWriteStream } = require('fs');
const { resolve } = require('path');
const { stdin, stdout } = process;

const outputStream = createWriteStream(resolve(__dirname, 'text.txt'), 'utf-8');

stdout.write('Ready to record, enter your text\n(Type "exit" or press Ctrl + C to quit)\n\n');

stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        process.exit();
    }
    outputStream.write(data);
});

process.on('exit', () => stdout.write('\nEnd of record. text.txt rewrited\n'));
