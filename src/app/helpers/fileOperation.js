/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/**
 * @file
 * This file includes all the functions related to file I/O.
 * All the scripts in the project can use the functions declared
 * here by importing from '../../helpers/fileOperation'.
 * --------------------------------------------------------
 * Available functions:
 * createDir
 * readDir
 * saveFile
 * readFile
 * deleteFile
 * moveFile
 * renameFile
 * saveLayout
 * loadLayout
*/

const fs = require('fs-extra');

/**
 * A function that creates a given new directory.
 * If the directory already exists, nothing will be done.
 *
 * @param {string} dir
 *  The directory to be created. The path should start
 *  from root of this project.
 * @return {int}
 *  If the given directory doesn't exist, this is 0.
 *  Otherwise, this will be a number indicating the
 *  system is creating a directory with the number in
 *  the back.
 *  However, if the creation process failed, this will
 *  be -1.
 */
export function createDir(dir) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      return 0;
    }
    // Directory exists
    let newDir;
    let num = 1;
    newDir = `${dir}(${num})`;
    while (fs.existsSync(newDir)) {
      num += 1;
      newDir = `${dir}(${num})`;
      if (num > 500) return -1; // num too large, prevent inf. loop
    }
    const ans = confirm(`[Warning] Directory exists. Would you like to name it ${newDir}?`);
    if (ans) {
      fs.mkdirSync(newDir);
      return num;
    }
    return -1;
  } catch (e) {
    alert('[ERROR] Failed creating new directory. Creation process aborted.');
    return -1;
  }
}

/**
 * A function that opens a given directory.
 * If the directory already exists, nothing will be done.
 *
 * @param {string} dir
 *  The directory to be created. The path should start
 *  from root of this project.
 * @return {array}
 *  An object array. Each object contains the filename
 *  and an boolean value indicating whether the file is
 *  a directory or not.
 */
export function readDir(dir) {
  let arr = []; // array of filenames
  const ret = []; // the return array of objects
  if (!fs.existsSync(dir)) {
    alert('[ERROR] The given directory does not exist.');
  }
  try {
    arr = fs.readdirSync(dir);
    arr.forEach((item) => {
      let isDir;
      if (fs.lstatSync(`${dir}/${item}`).isDirectory()) {
        isDir = true;
      } else {
        isDir = false;
      }
      const obj = { item, isDir };
      ret.push(obj);
    });
  } catch (e) {
    alert('[ERROR] Failed reading directory.');
  }
  return ret;
}

/**
 * A function that saves given contents into a given file.
 * If the file already exists, it will be overwritten.
 *
 * @param {string} filename
 *  The file to be written. The path should start
 *  from root of this project.
 * @param {string} path
 *  The directories created by our button
 * @param {string} content
 *  The content to be written.
 */
export function saveFile(filename, content) {
  // const fs = require('fs-extra');
  try {
    fs.writeFileSync(filename, content, 'utf-8');
  } catch (e) {
    alert('[WARNING] Failed to save the file! Try again later.');
    console.log(e);
  }
}

/**
 * A function that reads a savefile and returns
 * the string saved.
 *
 * @param {string} filename
 *  The file to open. The path should start
 *  from root of this project.
 * @param {string} path
 *  The directories created by our button
 * @return {string}
 *  The string saved in the file. If failed reading
 *  the file, this string will be empty.
 */
export function readFile(filename) {
  let ret;
  try {
    ret = fs.readFileSync(filename, 'utf-8');
  } catch (e) {
    // alert('[WARNING] Failed reading file ', filename);
    ret = '';
  }
  return ret;
}

/**
 * A function that deletes a given directory or file.
 *
 * @param {string} dir
 *  The directory to be deleted. The path should start
 *  from root of this project.
 */
export function deleteFile(dir) {
  try {
    fs.removeSync(dir);
  } catch (e) {
    alert('[WARNING] Failed deleting directory.');
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
    alert('[WARNING] Failed to rename the file! Try again later.');
  }
}

/**
 * A function that saves current GUI layout.
 * Should be called before closing the app.
 *
 * @param {array} componentArr
 *  The array of components existing on the window.
 *  They should be saved in an array of objects
 *  written in json format.
 * @param {int} componentCounter
 * The number of components in componentArr.
 */
export function saveLayout(componentArr, componentCounter) {
  // const fs = require('fs-extra');
  console.log('save layout');
  const arr = [];
  componentArr.forEach((item) => {
    if (item.props.name) {
      arr.push(item.props);
    }
  });
  arr.push(componentCounter);
  try {
    fs.writeFileSync('./savefiles/window-layout.json', JSON.stringify(arr), 'utf-8');
  } catch (e) {
    alert('[WARNING] Failed saving window layout!');
  }
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
    alert('[WARNING] Failed loading window layout! Using default.');
    return [];
  }
}
