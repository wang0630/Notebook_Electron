import React from 'react';
import MainLayout from '../main-layout/main-layout';
import AddNote from '../add-note/add-note';

// Create main App component
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWindow: 'mainLayout'
    };
    this.ChangeWindow = this.ChangeWindow.bind(this);
  }

  ChangeWindow(targetWindow) {
    this.setState({
      currentWindow: targetWindow
    });
  }

  render() {
    let c = null;
    const { currentWindow } = this.state;
    switch (currentWindow) {
      case 'addNote':
        c = <AddNote />;
        break;
      default:
        c = <MainLayout onChangeWindow={this.ChangeWindow} />;
    }
    return c;
  }
}
