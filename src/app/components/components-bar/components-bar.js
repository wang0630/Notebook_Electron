import React from 'react';
import { Button } from 'antd';
import './components-bar.scss';

const componentsList = [
  {
    value: 'new-dir',
    name: 'New directory'
  },
  {
    value: 'new-note',
    name: 'New Note'
  },
  {
    value: 'search-bar',
    name: 'search bar'
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
      <Button
        type="primary"
        key={item.value}
        onClick={() => {
          if(item.name != 'search bar'){
            this.props.createDraggable(item.value, item.name);
          }
          else{
            this.props.flipSearch();
          }
        }}
      >
        {item.name}
      </Button>
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
