const { unlink, readdir, copyFile } = require('fs');
const fsPromise = require('fs/promises');
const { resolve } = require('path');
const { stdout } = process;

const readFrom = resolve(__dirname, 'files'),
      writeTo  = readFrom + '-copy';

async function copyDir(readFrom, writeTo) {
  await fsPromise.mkdir(writeTo, { recursive: true })

  let existingCopy = await fsPromise.readdir(writeTo, { withFileTypes: true });
  for (const file of existingCopy) {
    unlink( resolve(writeTo, `${ file.name }`), err => {
      if (err) throw err;
    });
  }

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
