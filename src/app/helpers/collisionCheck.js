import rTree from 'rtree';
import { moveFile } from './fileOperation';

const myRTree = rTree(10);
const width = 90;
const height = 100;

/**
 * A function that checks for collision in
 * linear time.
 *
 * @param {Array} componentArr
 *  The component array in playground.
 * @param {int} x
 *  The x position of the moving object.
 * @param {int} y
 *  The y position of the moving object.
 * @param {int} moveID
 *  The object ID of the moving object.
 * @return {int}
 *  A number indicates checking result.
 *  0 : No collision.
 *  1 : Collision with directory, move the file
 *      into the directory.
 *  2 : Collision with note.
 */
export function linearCollisionCheck(componentArr, x, y, moveID) {
  let result = 0;
  componentArr.forEach((item) => {
    if (item.props.id !== moveID) {
      if (Math.abs(item.props.x - x) <= width && Math.abs(item.props.y - y) <= height) {
        if (item.props.compType === 'new-dir') {
          const comp = componentArr.find(tmp => tmp.props.id === moveID);
          moveFile(`${comp.props.path}${comp.props.name}`, `${item.props.path}${item.props.name}/${comp.props.name}`);
          result = 1;
        } else {
          result = 2;
        }
      }
    }
  });
  return result;
}

// R tree optimization here heheXD

/**
 * A function that inserts a component into
 * the R-Tree for collision detection.
 *
 * @param {object} comp
 *  The draggable component in playground.
 */
export function rTreeInsert(comp) {
  myRTree.insert({
    x: comp.props.x,
    y: comp.props.y,
    w: width,
    h: height
  }, comp);
}

/**
 * A function that removes a component from
 * the R-Tree for collision detection.
 *
 * @param {object} comp
 *  The draggable component in playground.
 */
export function rTreeDelete(comp) {
  myRTree.remove({
    x: comp.props.x,
    y: comp.props.y,
    w: width,
    h: height
  }, comp);
}

/**
 * A function that checks for collision with
 * a given component.
 *
 * @param {object} comp
 *  The draggable component in playground to
 *  be checked.
 */
export function rTreeCollisionCheck(comp, x, y, moveID) {
  let nearbyObj = [];
  let result = 0;
  // nearbyObj = myRTree.search({
  //   x: comp.props.x,
  //   y: comp.props.y,
  //   w: width,
  //   h: height
  // });
  nearbyObj = myRTree.bbox([x - 50, y - 50], [x + 80, y + 80]);
  console.log('nearby : ', nearbyObj);
  nearbyObj.forEach((item) => {
    if (item.props.id !== moveID) {
      if (Math.abs(item.props.x - x) <= width && Math.abs(item.props.y - y) <= height) {
        if (item.props.compType === 'new-dir') {
          moveFile(`${comp.props.path}${comp.props.name}`, `${item.props.path}${item.props.name}/${comp.props.name}`);
          result = 1;
        } else {
          result = 2;
        }
      }
    }
  });
  // Checkpoint
  rTreeDelete(comp);
  return result;
}
