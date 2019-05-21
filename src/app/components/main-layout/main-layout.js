import React from 'react';

// Create main App component
export default class MainLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onChangeWindow } = this.props;
    return (
      <div className="test">
        <h1>Hello, first first Electron app changed! my h1</h1>
        <p>I hope shouldddddd gogogog you enjoy using this electron react app.</p>
        <button
          type="button"
          onClick={() => onChangeWindow('addNote')}
        >
          click me
        </button>
      </div>
    );
  }
}