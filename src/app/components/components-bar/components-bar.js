import React from 'react';
import './components-bar.scss';

// const componentsList = ['new-dir', 'new-note'];

class ComponentsBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'true',
    };
  }

  render() {
    return (
      this.state.show
        ? (
          <div className="components-bar">
            <button
              type="button"
              onClick={() => {
                this.props.createDraggable('dir', 'new-dir');
              }}
            >
              New Directory
            </button>
          </div>
        )
        : null
    );
  }
}

export default ComponentsBar;
