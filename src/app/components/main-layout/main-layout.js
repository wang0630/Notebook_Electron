import React from 'react';
import ComponentsBar from '../components-bar/components-bar';
import Playground from '../playground/playground';
import './main-layout.scss';

// Main layout for display the page
export default class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldCreateDraggable: false
    };
    this.createDraggable = this.createDraggable.bind(this);
    this.clearShouldCreateDraggable = this.clearShouldCreateDraggable.bind(this);
  }

  createDraggable(compType, compName) {
    // create a draggable inside the playground
    this.setState({ shouldCreateDraggable: true, compType, compName });
  }

  clearShouldCreateDraggable() {
    this.setState({ shouldCreateDraggable: false });
  }

  render() {
    return (
      <section className="main-layout">
        <ComponentsBar
          clearisDragging={this.clearisDragging}
          createDraggable={this.createDraggable}
        />
        <Playground
          shouldCreateDraggable={this.state.shouldCreateDraggable}
          clearShouldCreateDraggable={this.clearShouldCreateDraggable}
          compType={this.state.compType}
          compName={this.state.compName}
        />
      </section>
    );
  }
}
