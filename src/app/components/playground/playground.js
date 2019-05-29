import React from 'react';
import Draggable from '../darggable/draggable';
import { saveLayout, loadLayout } from '../../helpers/fileOperation';
import './playground.scss';

export default class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exsistingComps: [],
    };
    this.updateLayout = this.updateLayout.bind(this);
    this.componentCount = 0;
    this.nodeRef = React.createRef();
  }

  componentDidMount() {
    // this.setState({
    //   exsistingComps: loadLayout(),
    // });
  }

  componentDidUpdate(prevProps, prevStat) {
    if (this.props.shouldCreateDraggable && !prevProps.shouldCreateDraggable) {
      // Create a new element
      const comp = {};
      // Create the props map
      comp.props = {
        compType: this.props.compType,
        compName: this.props.compName,
        x: 300,
        y: 300,
        id: this.componentCount
      };
      // Create the init style of the component
      comp.c = (
        <Draggable
          id={this.componentCount}
          cbWidth={this.props.cbWidth}
          rightBound={this.nodeRef.current.offsetWidth}
          bottomBound={this.nodeRef.current.offsetHeight}
          compType={this.props.compType}
          updateLayout={this.updateLayout}
        />
      );
      // Update the state
      this.setState({
        exsistingComps: [...prevStat.exsistingComps, comp]
      }, () => {
        this.props.clearShouldCreateDraggable();
        this.componentCount += 1;
      });
    }
  }

  // It is called when onMouseUp event is fired in draggable
  updateLayout(position, id) {
    const { x, y } = position;
    this.setState((prevStat) => {
      console.log('before update', prevStat.exsistingComps);
      const comps = [...prevStat.exsistingComps];
      // Find the right component according to id
      const comp = comps.find(item => item.props.id === id);
      comp.props.x = x;
      comp.props.y = y;
      return {
        exsistingComps: comps
      };
    }, () => {
      console.log('after update', this.state.exsistingComps);
      saveLayout(this.state.exsistingComps);
    });
  }

  render() {
    // Extract the exsisting components
    const r = this.state.exsistingComps.map(comp => comp.c);
    return (
      <section className="playground" ref={this.nodeRef}>
        { r }
      </section>
    );
  }
}
