import React from 'react';
import ComponentsBar from '../components-bar/components-bar';
import Playground from '../playground/playground';
import './main-layout.scss';

// Main layout for display the page
export default class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldCreateDraggable: false,
      cbWidth: 0,
      search_button_clicked: false
    };
    this.createDraggable = this.createDraggable.bind(this);
    this.clearShouldCreateDraggable = this.clearShouldCreateDraggable.bind(this);
    this.getComponentBarWidth = this.getComponentBarWidth.bind(this);
    this.flipSearch = this.flipSearch.bind(this);
  }

  createDraggable(compType, compName) {
    // create a draggable inside the playground
    this.setState({ shouldCreateDraggable: true, compType, compName });
  }

  clearShouldCreateDraggable() {
    this.setState({ shouldCreateDraggable: false });
  }

  getComponentBarWidth(width) {
    this.setState({ cbWidth: width });
  }

  flipSearch(){
    this.setState({ search_button_clicked: !this.state.search_button_clicked});
    console.log(this.state.search_button_clicked);
  }

  render() {
    return (
      <section className="main-layout">
        <ComponentsBar
          clearisDragging={this.clearisDragging}
          createDraggable={this.createDraggable}
          getComponentBarWidth={this.getComponentBarWidth}
          flipSearch={this.flipSearch}
        />
        <Playground
          shouldCreateDraggable={this.state.shouldCreateDraggable}
          clearShouldCreateDraggable={this.clearShouldCreateDraggable}
          compType={this.state.compType}
          compName={this.state.compName}
          cbWidth={this.state.cbWidth}
          search_button_clicked = {this.state.search_button_clicked}
        />
      </section>
    );
  }
}
