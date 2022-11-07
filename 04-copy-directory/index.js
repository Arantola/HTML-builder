const { mkdir, readdir, copyFile } = require('fs');
const { resolve } = require('path');
const { stdout } = process;

const readFrom = resolve(__dirname, 'files'),
      writeTo  = readFrom + '-copy';

function copyDir(readFrom, writeTo) {
  mkdir(writeTo, { recursive: true }, err => {
    if (err) throw err;
  });

  readdir(readFrom, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    for(let file of files) {
      if (file.isFile()) {
        copyFile( resolve(readFrom, file.name),
                  resolve(writeTo, file.name), err => {
          if (err) throw err;
        })
      } else {
        copyDir(resolve(readFrom, file.name),
                resolve(writeTo, file.name));
      }
    }
    stdout.write('Directory copied');
  });
}

copyDir(readFrom, writeTo);
