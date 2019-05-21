import React from 'react';
import ComponentsBar from '../components-bar/components-bar';

// Create main App component
export default class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: '123'
    };
  }

  render() {
    const { onChangeWindow } = this.props;
    return (
      <section className="main-layout">
        <h1>Hello, first first Electron app changed! my h1</h1>
        <ComponentsBar />

      </section>
    );
  }
}