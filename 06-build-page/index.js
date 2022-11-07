const fs = require('fs');
const { resolve, extname } = require('path');
const fsPromise = require('fs/promises');
const { stdout } = process;

const srcHtml       = resolve(__dirname, 'template.html'),
      srcComponents = resolve(__dirname, 'components'),
      srcStyles     = resolve(__dirname, 'styles'),
      srcAssets     = resolve(__dirname, 'assets');

const distProject   = resolve(__dirname, 'project-dist'),
      distHtml      = resolve( distProject, 'index.html'),
      distStyles    = resolve( distProject, 'style.css'),
      distAssets    = resolve( distProject, 'assets');


(async () => {
  await fsPromise.mkdir( distProject, { recursive: true });
  await fsPromise.mkdir( distAssets, { recursive: true });
  await fsPromise.writeFile( distHtml, '');
  await fsPromise.writeFile( distStyles, '');
})();


async function copyDirectory (srcAssets, distAssets) {
  try {

    const originalDir = await fsPromise.readdir(srcAssets, { withFileTypes: true });

    for (const dir of originalDir) {
      if (dir.isDirectory) {
        let subDirectory = await fsPromise.readdir(
            resolve(`${ srcAssets  }`, `${ dir.name }`), { withFileTypes: true });
        await fsPromise.mkdir(
            resolve(`${ distAssets }`, `${ dir.name }`), { recursive: true });

        let existingCopy = await fsPromise.readdir(
            resolve(`${ distAssets }`, `${ dir.name }`), { withFileTypes: true });
        for (const file of existingCopy) {
          fs.unlink( resolve(`${ distAssets }`, `${ dir.name }`, `${ file.name }`), 
                     err => {
                      if (err) throw err;
                    });
        }

        for (const file of subDirectory) {
          fs.copyFile(
            resolve(`${ srcAssets  }`, `${ dir.name }`, `${ file.name }`),
            resolve(`${ distAssets }`, `${ dir.name }`, `${ file.name }`), 
            err => {
            if (err) throw err;
            }
          );
        }
      }
    }

  } catch (err) {
    throw err;
  }
}


async function createHtml(srcHtml, srcComponents, distHtml) {
  try {

    const initialHtml    = await fsPromise.readFile(srcHtml, 'utf-8'),
          htmlComponents = await fsPromise.readdir(srcComponents, {withFileTypes: true});

    let htmlAsText       = initialHtml.toString(),
        currentComponent = '';

    for (const component of htmlComponents) {
      if (component.isFile() && extname(component.name) === '.html'){

        currentComponent = await fsPromise.readFile( 
            resolve( srcComponents, `${component.name}`), 'utf-8');
        htmlAsText = htmlAsText.replace(`{{${component.name.slice(0, -5)}}}`,
                                        currentComponent.toString());

      }
    }
    fsPromise.writeFile( distHtml, htmlAsText);

  }  catch(err) {
    throw err;
  }
}


async function copyStyles(fromDir, toFile) {
  try {

    let stylesComponents = await fsPromise.readdir(fromDir, {withFileTypes: true});

    for (let styles of stylesComponents) {
      if (styles.isFile() === true && extname(styles.name) === '.css') {

        let currentFile = await fsPromise.readFile(
            resolve(fromDir, `${styles.name}`), 'utf-8');

        fs.appendFile(toFile, currentFile, err => {
          if (err) throw err;
        });
      }
    }
  } catch (err) {
    console.log((err)); 
  }
}

copyDirectory(srcAssets, distAssets);
createHtml(srcHtml, srcComponents, distHtml);
copyStyles(srcStyles, distStyles);
stdout.write('Build ready');
