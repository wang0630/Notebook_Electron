import React from 'react';
import { Icon, Input } from 'antd';
import componentsMapping from '../../constant/components-constant';
import './draggable.scss';

export default class Draggable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beingDragged: false,
      x: 300,
      y: 300,
      relx: 0,
      rely: 0,
    };
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
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

  onMouseDown(e) {
    // Not left button
    e.persist();
    if (e.button !== 0) return;
    // console.log('In draggable mousedown ', e.pageX - 300 - this.props.cbWidth, e.pageX);
    this.setState(prevStat => ({
      beingDragged: true,
      relx: e.pageX - prevStat.x - this.props.cbWidth,
      rely: e.pageY - prevStat.y
    }));
  }

  onMouseMove(e) {
    if (this.state.beingDragged) {
      e.persist();
      console.log(`offy: ${this.nodeRef.current.offsetTop}, px: ${e.pageX}, py: ${e.pageY} off: ${this.nodeRef.current.offsetLeft}`); 
      this.setState((prevStat) => {
        let currentX = e.pageX - this.props.cbWidth - prevStat.relx;
        let currentY = e.pageY - prevStat.rely;
        console.log('currentX: ', currentX);
        // If the position is out of biund

        // left
        if (this.nodeRef.current.offsetLeft <= 0) {
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
    // console.log(e);
    // toggle isDragging
    // this.props.clearisDragging();
    // Update the x, y in the reference array in mainLayout

    // Do whatever it should according to the type
  }

  // Prevent the user moving the cursor too fast
  // and mouseUp event is not fired before even leaving the object
  onMouseLeave() {
    this.setState({ beingDragged: false });
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
        className="draggable"
        style={style}
        ref={this.nodeRef}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseLeave}
      >
        <Icon
          type={mapping.type}
          style={{
            fontSize: '70px',
            color: mapping.color
          }}
        />
        <Input
          placeholder="Enter the name"
          size="small"
          onPressEnter={() => console.log('enter')}
          onChange={(e) => {
            ;
          }}
        />
      </div>
    );
  }
}
