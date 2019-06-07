import React from 'react';
import { Button } from 'antd';
import { ipcRenderer } from 'electron';
import Draggable from '../darggable/draggable';
import { saveLayout, loadLayout } from '../../helpers/fileOperation';
import './playground.scss';

export default class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exsistingComps: [],
      showClose: false
    };
    this.updateLayout = this.updateLayout.bind(this);
    this.showCloseOptions = this.showCloseOptions.bind(this);
    this.componentCount = 0;
    this.nodeRef = React.createRef();
  }

  // Load the window layout of last session
  componentDidMount() {
    let layoutArr = [];
    const finalArr = [];
    layoutArr = loadLayout();
    console.log('Loaded : ', layoutArr);
    const compCount = layoutArr.pop();
    if (compCount) {
      this.componentCount = compCount;
    }
    layoutArr.forEach((item) => {
      // Create a new element
      const comp = {};
      // Create the props map
      comp.props = {
        compType: item.compType,
        compName: item.compName,
        x: item.x,
        y: item.y,
        id: item.id,
        name: item.name,
      };
      // Create the init style of the component
      comp.c = (
        <Draggable
          id={item.id}
          name={item.name}
          cbWidth={this.props.cbWidth}
          rightBound={this.nodeRef.current.offsetWidth}
          bottomBound={this.nodeRef.current.offsetHeight}
          compType={item.compType}
          updateLayout={this.updateLayout}
          showCloseOptions={this.showCloseOptions}
          initX={item.x}
          initY={item.y}
        />
      );
      finalArr.push(comp);
    });
    // Ready all components
    this.setState({
      exsistingComps: finalArr,
    });
  }

  componentDidUpdate(prevProps, prevStat) {
    if (this.props.shouldCreateDraggable && !prevProps.shouldCreateDraggable) {
      // Create a new element
      const comp = {};
      // Create the props map
      comp.props = {
        compType: this.props.compType,
        compName: this.props.compName,
        name: 'yeenit',
        x: 300,
        y: 300,
        id: this.componentCount
      };
      // Create the init style of the component
      comp.c = (
        <Draggable
          id={this.componentCount}
          cbWidth={this.props.cbWidth}
          rightBound={this.nodeRef.current.offsetWidth}
          bottomBound={this.nodeRef.current.offsetHeight}
          compType={this.props.compType}
          updateLayout={this.updateLayout}
          showCloseOptions={this.showCloseOptions}
          initX={300}
          initY={300}
        />
      );
      // Update the state
      this.setState({
        exsistingComps: [...prevStat.exsistingComps, comp]
      }, () => {
        this.props.clearShouldCreateDraggable();
        this.componentCount += 1;
        console.log(this.componentCount);
      });
    }
  }

  // It is called when onMouseUp event is fired in draggable
  updateLayout({ x, y, name, id }) {
    this.setState((prevStat) => {
      // console.log('before update', prevStat.exsistingComps);
      const comps = [...prevStat.exsistingComps];
      // Find the right component according to id
      const comp = comps.find(item => item.props.id === id);
      comp.props.x = x;
      comp.props.y = y;
      comp.props.name = name;
      return {
        exsistingComps: comps
      };
    }, () => {
      console.log('after update', this.state.exsistingComps);
      saveLayout(this.state.exsistingComps, this.componentCount);
    });
  }

  showCloseOptions() {
    this.setState({
      showClose: true
    });
  }

  render() {
    // Extract the exsisting components
    const r = this.state.exsistingComps.map(comp => comp.c);
    return (
      <section className="playground" ref={this.nodeRef}>
        { r }
        {
          this.state.showClose
            ? (
              <div className="playground__close">
                <p className="playground__warning">
                  Do you want to remove icon or the whole folder?
                </p>
                <Button
                  className="playground__btn--1"
                  type="primary"
                  ghost
                >
                  Only remove icon
                </Button>
                <Button
                  className="playground__btn--2"
                  type="danger"
                  ghost
                >
                  Delete whole folder
                </Button>
                <Button
                  className="playground__cancel-btn"
                  type="dashed"
                  onClick={() => {
                    this.setState({ showClose: false });
                  }}
                  ghost
                >
                  Cancel
                </Button>
              </div>
            )
            : null
        }
      </section>
    );
  }
}
