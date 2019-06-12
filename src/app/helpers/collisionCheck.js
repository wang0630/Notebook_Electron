import { moveFile } from './fileOperation';
// import rTree from 'rTree';

// let myRTree = RTree(10);
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
        console.log('collision!');
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

// export function rTreeInsert(comp) {
//   myRTree.insert({
//     x: comp.props.x,
//     y: comp.props.y,
//     w: width,
//     h: height
//   }, comp);
// }

// export function rTreeCollision() {
//   console.log('R-TREEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
// }
