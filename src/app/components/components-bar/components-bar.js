import React from 'react';
import { createDir, writeFile, saveLayout, loadLayout, moveFile } from '../../helpers/fileOperation';

export default class ComponentsBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'true',
      test: [{type: 'Dir', x: 1, y:2}, {type: 'file', x:3, y:4}]
    };
  }

  render() {
    return (
      <div className="components-bar">
        <h1> CBar </h1>
        <button
          type="button"
          onClick={ () => createDir('./savefiles/temp') }
        >
          Create dir
        </button>
        <button
          type="button"
          onClick={ () => saveLayout(this.state.test) }
        >
          Save layout
        </button>
        <button
          type="button"
          onClick={ () => loadLayout() }
        >
          Load layout
        </button>
        <button
          type="button"
          onClick={ () => moveFile('./savefiles/window-layout.json', './savefiles/tmp/window-layout.json') }
        >
          Test move
        </button>
      </div>
    );
  }
}
