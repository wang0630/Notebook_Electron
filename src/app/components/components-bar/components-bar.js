import React from 'react';
import './components-bar.scss';

const componentsList = [
  {
    value: 'new-dir',
    name: 'New directory'
  },
  {
    value: 'new-note',
    name: 'New Note'
  }
];

export default class ComponentsBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'true',
    };
    this.nodeRef = React.createRef();
    this.createButtons = this.createButtons.bind(this);
  }

  componentDidMount() {
    // Pass the width to main-layout
    this.props.getComponentBarWidth(this.nodeRef.current.offsetWidth);
  }

  createButtons() {
    return componentsList.map(item => (
      <button
        type="button"
        // key={`button-${index}`}
        onClick={() => {
          this.props.createDraggable(item.value, item.name);
        }}
      >
        {item.name}
      </button>
    ));
  }

  render() {
    return (
      this.state.show
        ? (
          <div className="components-bar" ref={this.nodeRef}>
            { this.createButtons() }
          </div>
        )
        : null
    );
  }
}
