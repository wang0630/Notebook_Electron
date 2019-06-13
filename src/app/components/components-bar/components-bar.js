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
      show: true,
    };
    this.nodeRef = React.createRef();
    this.createButtons = this.createButtons.bind(this);
  }

  componentDidMount() {
    // Pass the width to main-layout
    this.props.setComponentBarWidth(this.nodeRef.current.offsetWidth);
    this.openDialogToGetFolder = this.openDialogToGetFolder.bind(this);
    this.nodeRef.current.style.transform = 'translateX(-96%)';
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
              // Brand new draggable(folder or note)
              this.props.createDraggable(item.value, '');
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
      <div
        className="components-bar"
        ref={this.nodeRef}
        onFocus={() => {}}
        onMouseOver={() => {
          if (this.state.show) {
            this.nodeRef.current.style.transform = 'translateX(0%)';
            this.props.setComponentBarWidth(this.nodeRef.current.offsetWidth);
            this.setState({ show: false });
          }
        }}
        onMouseLeave={() => {
          if (!this.state.show) {
            this.nodeRef.current.style.transform = 'translateX(-96%)';
            this.props.setComponentBarWidth(this.nodeRef.current.offsetWidth * 0.04);
            this.setState({ show: true });
          }
        }}
      >
        { this.createButtons() }
      </div>
    );
  }
}
