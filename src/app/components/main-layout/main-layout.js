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
      search_button_clicked: false,
    };
    this.createDraggable = this.createDraggable.bind(this);
    this.clearShouldCreateDraggable = this.clearShouldCreateDraggable.bind(this);
    this.setComponentBarWidth = this.setComponentBarWidth.bind(this);
    this.getComponentBarWidth = this.getComponentBarWidth.bind(this);
    this.flipSearch = this.flipSearch.bind(this);
  }

  createDraggable(compType, folderPath) {
    // create a draggable inside the playground
    this.setState({ shouldCreateDraggable: true, compType, folderPath });
  }

  clearShouldCreateDraggable() {
    this.setState({ shouldCreateDraggable: false });
  }

  setComponentBarWidth(width) {
    this.setState({ cbWidth: width });
  }

  getComponentBarWidth() {
    return this.state.cbWidth;
  }

  flipSearch() {
    this.setState(prevStat => ({
      search_button_clicked: !prevStat.search_button_clicked
    }));
  }

  render() {
    return (
      <section className="main-layout">
        <ComponentsBar
          clearisDragging={this.clearisDragging}
          createDraggable={this.createDraggable}
          setComponentBarWidth={this.setComponentBarWidth}
          flipSearch={this.flipSearch}
        />
        <Playground
          shouldCreateDraggable={this.state.shouldCreateDraggable}
          clearShouldCreateDraggable={this.clearShouldCreateDraggable}
          compType={this.state.compType}
          getCBWidth={this.getComponentBarWidth}
          folderPath={this.state.folderPath}
          search_button_clicked={this.state.search_button_clicked}
        />
      </section>
    );
  }
}
