/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/**
 * @file
 * This file includes all the functions related to file I/O.
 * All the scripts in the project can use the functions declared
 * here by importing from '../../helpers/fileOperation'.
 */

const fs = require('fs-extra');

/**
 * A function that creates a given new directory.
 * If the directory already exists, nothing will be done.
 *
 * @param {string} dir
 *  The directory to be created. The path should start
 *  from root of this project.
 */
export function createDir(dir) {
  // const fs = require('fs-extra');
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  } catch (e) {
    alert('[ERROR] Failed creating new directory. Creation process aborted.');
  }
}

/**
 * A function that saves given contents into a given file.
 * If the file already exists, it will be overwritten.
 *
 * @param {string} filename
 *  The file to be written. The path should start
 *  from root of this project.
 * @param {string} content
 *  The content to be written.
 */
export function saveFile(filename, content) {
  // const fs = require('fs-extra');
  try { fs.writeFileSync(filename, content, 'utf-8'); }
  catch (e) { alert('[WARNING] Failed to save the file! Try again later.'); }
}

/**
 * A function that saves current GUI layout.
 * Should be called before closing the app.
 *
 * @param {array} componentArr
 *  The array of components existing on the window.
 *  They should be saved in an array of objects
 *  written in json format.
 */
export function saveLayout(componentArr) {
  // const fs = require('fs-extra');
  console.log('save layout');
  const arr = [];
  componentArr.forEach((item) => {
    arr.push(item.props);
  });
  try { fs.writeFileSync('./savefiles/window-layout.json', JSON.stringify(arr), 'utf-8'); }
  catch (e) { alert('[WARNING] Failed saving window layout!'); }
}

/**
 * A function that loads GUI layout last run.
 * Should be called when the app is executed.
 *
 * @return {array}
 *  The array of objects, written in json format,
 *  to be rendered on the window.
 */
export function loadLayout() {
  // var fs = require('fs-extra');
  try {
    const data = fs.readFileSync('./savefiles/window-layout.json', 'utf-8');
    const ret = JSON.parse(data);
    console.log('The file content is : ', ret);
    return ret;
  } catch {
    alert('[WARNING] Failed loading window layout!');
    return [];
  }
}

/**
 * A function that moves a file to another
 * location. If the file already exists in
 * the destination directory, the user can
 * choose whether to overwrite it or not.
 *
 * @param {string} srcPath
 *  The source path of the file. The path
 *  should start from root of this project.
 * @param {string} destPath
 *  The destination path of the file. The path
 *  should start from root of this project.
 */
export function moveFile(srcPath, destPath) {
  // const fs = require('fs-extra');

  try {
    if (fs.existsSync(srcPath)) {
      // Source file exists
      if (fs.existsSync(destPath)) {
        // Dest file exists, ask user if they want to replace
        const ans = confirm('[Warning] File already exists in the given destination. Do you wish to replace it?');
        if (ans) {
          fs.moveSync(srcPath, destPath, { overwrite: true });
        }
      } else {
        fs.moveSync(srcPath, destPath);
      }
    } else {
      alert('[ERROR] Trying to move a file that does not exist.');
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * A function that renames an existing
 * file or folder.
 *
 * @param {string} oldPath
 *  The source path of the file. The path
 *  should start from root of this project.
 * @param {string} newPath
 *  The destination path of the file. The path
 *  should start from root of this project.
 */
export function renameFile(oldPath, newPath) {
  // const fs = require('fs-extra');
  try {
    fs.renameSync(oldPath, newPath);
  } catch (e) {
    alert('[WARNING] Failed to save the file! Try again later.');
  }
}
