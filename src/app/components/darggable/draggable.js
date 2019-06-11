import React from 'react';
import { Icon, Input } from 'antd';
import { createDir, saveFile, renameFile } from '../../helpers/fileOperation';
import componentsMapping from '../../constant/components-constant';
import savefileRoot from '../../constant/file-system-constants';
import TextEditor from '../text-editor/text-editor';
import './draggable.scss';

export default class Draggable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beingDragged: false,
      x: this.props.initX,
      y: this.props.initY,
      relx: 0,
      rely: 0,
      isNamed: false,
      toRename: false,
      name: this.props.name,
      clicked: false,
    };
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updatePlaygroundLayout = this.updatePlaygroundLayout.bind(this);
    this.nodeRef = React.createRef();
    this.id = this.props.id;
  }

  componentDidMount() {
    // this.setState({
    //   leftBound: this.nodeRef.offsetLeft,
    //   // rightBound: this.nodeRef.offsetRight,
    //   topBound: this.nodeRef.offsetTop,
    //   // downBound: this.nodeRef.offsetDown,
    // });
  }

  updateName(newName) {
    if (!newName) {
      // alert('[WARNING] Trying to name something as empty.');
      return;
    }
    // The file already exists, just rename the old one.
    if (this.state.toRename) {
      console.log(`change name from ${this.state.name} to ${newName}`);
      renameFile(`${savefileRoot}${this.state.name}`, `${savefileRoot}${newName}`);
      this.setState({
        isNamed: true,
        name: newName,
        toRename: false,
      }, () => this.updatePlaygroundLayout());
      return;
    }
    if (newName) {
      // The file does not exist, create a new one with the given name.
      this.setState({
        isNamed: true,
        name: newName,
      }, () => this.updatePlaygroundLayout());
      if (this.props.compType === 'new-dir') {
        createDir(`${savefileRoot}${newName}`);
      } else if (this.props.compType === 'new-note') {
        // Create a empty file
        saveFile(`${savefileRoot}${newName}`, '');
        // Open ur cuuuuuute little text area here weeeeeeeeeeeeeeee
      }
    }
  }

  onMouseDown(e) {
    // Not left button
    e.persist();
    if (e.button !== 0 || e.target.tagName === 'INPUT') return;
    console.log('In draggable mousedown');
    this.setState(prevStat => ({
      beingDragged: true,
      relx: e.pageX - prevStat.x - this.props.cbWidth,
      rely: e.pageY - prevStat.y
    }));
  }

  // What's that dark shadowy place down here, papa?
  // It's legacy code. We don't go there, Simba.
  onMouseMove(e) {
    if (this.state.beingDragged) {
      e.persist();
      this.setState((prevStat) => {
        let currentX = e.pageX - this.props.cbWidth - prevStat.relx;
        let currentY = e.pageY - prevStat.rely;
        // If the position is out of bound
        // left
        if (this.nodeRef.current.offsetLeft <= 10) {
          if (currentX < prevStat.x) {
            currentX = prevStat.x;
          }
        }
        // right
        if (currentX + this.nodeRef.current.offsetWidth >= this.props.rightBound) {
          if (currentX > prevStat.x) {
            currentX = prevStat.x;
          }
        }
        // bottom
        if (currentY + this.nodeRef.current.offsetHeight >= this.props.bottomBound) {
          if (currentY > prevStat.y) {
            currentY = prevStat.y;
          }
        }
        // top
        if (this.nodeRef.current.offsetTop < 0) {
          if (currentY < prevStat.y) {
            currentY = prevStat.y;
          }
        }
        return {
          ...prevStat,
          x: currentX,
          y: currentY
        };
      });
    }
  }

  onMouseUp() {
    console.log('In draggable mouseup');
    this.setState({ beingDragged: false });
    // Update the x, y in the reference array in mainLayout
    this.updatePlaygroundLayout();
    // Do whatever it should according to the type
  }

  // Prevent the user moving the cursor too fast
  // and mouseUp event is not fired before even leaving the object
  onMouseLeave() {
    this.setState({ beingDragged: false });
    // Update the x, y in the reference array in mainLayout
  }

  updatePlaygroundLayout() {
    const stat = { x: this.state.x, y: this.state.y, name: this.state.name, id: this.id };
    this.props.updateLayout(stat);
  }

  onCloseClick() {
    this.props.showCloseOptions(this.id);
  }

  displayIcon(mapping) {
    switch (mapping.type) {
      case 'text-area':
        return (
          <TextEditor
            onCloseClick={this.onCloseClick}
            filename={this.state.name}
            updateName={this.updateName}
          />
        );
      case 'folder-add':
      default:
        return (
          <React.Fragment>
            <Icon
              type={mapping.type}
              style={{
                fontSize: '70px',
                color: mapping.color
              }}
            />
            <Icon
              type="close-circle"
              theme="filled"
              onClick={this.onCloseClick}
              style={{
                fontSize: '20px',
                position: 'absolute',
                top: '5%',
                right: '5%',
                color: mapping.color
              }}
            />
            {
              (this.state.name && !this.state.toRename)
                ? (
                  <span className="draggable__span">
                    { this.state.name }
                  </span>
                )
                : (
                  <Input
                    placeholder="Enter the name"
                    defaultValue={this.state.name}
                    size="small"
                    onPressEnter={e => this.updateName(e.target.value)}
                  />
                )
            }
          </React.Fragment>
        );
    }
  }

  render() {
    const style = {
      position: 'absolute',
      left: `${this.state.x}px`,
      top: `${this.state.y}px`
    };
    const mapping = componentsMapping[this.props.compType];
    return (
      <div
        className={`draggable ${this.state.clicked ? 'draggable-clicked' : ''}`}
        // Add tab index to make this div focusable
        tabIndex={-1}
        style={style}
        ref={this.nodeRef}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseLeave}
        onFocus={(e) => {
          // Don't get focus when input is focused
          if (e.target.tagName !== 'INPUT') {
            this.setState({ clicked: true });
          }
        }}
        onBlur={() => { this.setState({ clicked: false }); }}
        onKeyPress={(e) => {
          // If user press enter and the div is clicked
          if (e.key === 'Enter' && this.state.clicked) {
            this.setState({
              clicked: false,
              isNamed: false,
              toRename: true,
            });
          }
        }}
      >
        {this.displayIcon(mapping)}
      </div>
    );
  }
}
