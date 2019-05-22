import React from 'react';
import Draggable from '../darggable/draggable';
import './playground.scss';

export default class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exsistingComps: [],
    };
    this.componentCount = 0;
  }

  componentDidUpdate(prevProps, prevStat) {
    if (this.props.shouldCreateDraggable && !prevProps.shouldCreateDraggable) {
      console.log('here in update');
      // Create a new element
      const comp = {};
      // Create the props map
      comp.props = {
        compType: this.props.compType,
        compName: this.props.compName,
        x: 400,
        y: 400,
        id: this.componentCount
      };
      // Create the init style of the component
      comp.c = <Draggable id={this.componentCount} />;
      // Update the state
      this.setState({
        exsistingComps: [...prevStat.exsistingComps, comp]
      }, () => {
        this.props.clearShouldCreateDraggable();
        this.componentCount += 1;
      });
    }
  }

  render() {
    // Extract the exsisting components
    const r = this.state.exsistingComps.map(comp => comp.c);
    return (
      <section className="playground">
        { r }
      </section>
    );
  }
}
