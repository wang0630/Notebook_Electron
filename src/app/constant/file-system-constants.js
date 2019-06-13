import path from 'path';
import { remote } from 'electron';

const savefileRoot = path.join(remote.app.getPath('appData'), '/savefiles');
const savefileRoot1 = `${savefileRoot}/`;
console.log(savefileRoot1);
// const savefileRoot = './savefiles/';

export default savefileRoot1;
