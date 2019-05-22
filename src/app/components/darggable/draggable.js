import React from 'react';
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
    this.id = this.props.id;
  }

  onMouseDown(e) {
    // Not left button
    e.persist();
    if (e.button !== 0) return;
    console.log('In draggable mousedown ', this.id);
    this.setState(prevStat => ({
      beingDragged: true,
      relx: e.pageX - prevStat.x,
      rely: e.pageY - prevStat.y
    }));
  }

  onMouseMove(e) {
    if (this.state.beingDragged) {
      e.persist();
      console.log(`relx: ${this.state.relx}, rely: ${this.state.rely}, px: ${e.pageX}, py: ${e.pageY} `);
      this.setState(prevStat => ({
        ...prevStat,
        x: e.pageX - prevStat.relx,
        y: e.pageY - prevStat.rely
      }));
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
    return (
      <div
        className="draggable"
        style={style}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseLeave}
      />
    );
  }
}
