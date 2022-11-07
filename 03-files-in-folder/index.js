const { readdir, stat } = require('fs');
const { resolve } = require('path');
const { stdout } = process;

const folderPath = resolve(__dirname, 'secret-folder');

readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  stdout.write("\nCurrent directory files:");

  files.forEach( file => {
    if (file.isFile()) {
      const name      = file.name.substring(0, file.name.lastIndexOf('.'))
                                 .padEnd(9, " ") || file.name.padEnd(9, " ");
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
                                 .padEnd(4, " ") || "".padEnd(4, " ");
      stat(resolve(folderPath, file.name), (err, stats) => {
        if (err) throw err;
        const size    = (stats.size / 1024).toFixed(3);
        stdout.write(`${name} - ${extension} - ${size}kb\n`);
      });
    }
  })

})
