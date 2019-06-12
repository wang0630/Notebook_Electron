import React from 'react';
import { Button } from 'antd';
import { remote } from 'electron';
import './components-bar.scss';

const { dialog } = remote;

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
    name: 'open existing folder'
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
    this.openDialogToGetFolder = this.openDialogToGetFolder.bind(this);
  }

  openDialogToGetFolder() {
    dialog.showOpenDialog(null, { properties: ['openFile', 'openDirectory'] }, (fileName) => {
      if (fileName) {
        console.log('In dialog: ', fileName[0]);
        this.props.createDraggable('new-dir', `${fileName[0]}/`);
      } else {
        console.log('no file');
      }
    });
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
              this.openDialogToGetFolder();
              break;
            }
            default: {
              this.props.createDraggable(item.value);
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
