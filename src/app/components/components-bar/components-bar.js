import React from 'react';

export default class ComponentsBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'true'
    };
  }

  render() {
    return (
      <div className="components-bar">
        <h1> CBar </h1>
        <button
          type="button"
        >
          click me
        </button>
      </div>
    );
  }
}
