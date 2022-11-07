const { createReadStream, createWriteStream } = require('fs');
const { writeFile, readdir } = require('fs/promises');
const { resolve, extname } = require('path');
const { stdout } = process;


const readStylesFrom = resolve(__dirname, 'styles');
const writeStylesTo  = resolve(__dirname, 'project-dist', 'bundle.css');

async function bundleStyles( styles, bundle ) {
  await writeFile(bundle, '');

  let files = (await readdir(styles)).filter( file => extname(file) === '.css');

  files.forEach( file => {
    let readStream  = createReadStream(resolve(styles, file), 'utf-8');
    let writeStream = createWriteStream(bundle, {flags: 'a'});
    readStream.pipe(writeStream);
  });

  stdout.write('bundle.css created')
}

bundleStyles(readStylesFrom, writeStylesTo);
