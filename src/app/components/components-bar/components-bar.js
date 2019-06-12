import React from 'react';
import { Button } from 'antd';
// import { remote } from 'electron';
import './components-bar.scss';

// const { dialog } = remote;
const { dialog } = require('electron').remote;

const componentsList = [
  {
    value: 'new-dir',
    name: 'New directory'
  },
  {
    value: 'text-area',
    name: 'New Note'
  },
  {
    value: 'search-bar',
    name: 'search bar'
  },
  {
    value: 'open-folder',
    name: 'open folder'
  }
];

export default class ComponentsBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'true',
    };
    this.nodeRef = React.createRef();
    this.createButtons = this.createButtons.bind(this);
  }

  componentDidMount() {
    // Pass the width to main-layout
    this.props.getComponentBarWidth(this.nodeRef.current.offsetWidth);
  }

  createButtons() {
    return componentsList.map(item => (
      <Button
        type="primary"
        key={item.value}
        onClick={() => {
          switch (item.value) {
            case 'search-bar': {
              this.props.flipSearch();
              break;
            }
            case 'open-folder': {
              dialog.showOpenDialog(null, { properties: ['openFile', 'openDirectory'] }, (fileName) => {
                if (fileName) {
                  console.log('In dialog: ', fileName);
                } else {
                  console.log('no file');
                }
              });
              break;
            }
            default: {
              this.props.createDraggable(item.value, item.name);
            }
          }
        }}
      >
        {item.name}
      </Button>
    ));
  }

  render() {
    return (
      this.state.show
        ? (
          <div className="components-bar" ref={this.nodeRef}>
            { this.createButtons() }
          </div>
        )
        : null
    );
  }
}
