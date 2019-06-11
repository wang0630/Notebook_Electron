import React from 'react';
import { Button } from 'antd';
import Draggable from '../darggable/draggable';
import { saveLayout, loadLayout, deleteFile } from '../../helpers/fileOperation';
import savefileRoot from '../../constant/file-system-constants';
import './playground.scss';

export default class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idToBeDeleted: null,
      exsistingComps: [],
      searchedComps: [],
      showClose: false,
      searched: false
    };
    this.updateLayout = this.updateLayout.bind(this);
    this.showCloseOptions = this.showCloseOptions.bind(this);
    this.hideCloseOptions = this.hideCloseOptions.bind(this);
    this.deleteIconAndFolder = this.deleteIconAndFolder.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
        path: item.path,
      };
      // Create the init style of the component
      comp.c = (
        <Draggable
          id={item.id}
          key={item.id}
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
      const INITX = 300;
      const INITY = 300;
      // Create a new element
      const comp = {};
      // Create the props map
      comp.props = {
        compType: this.props.compType,
        compName: this.props.compName,
        name: 'yeenit',
        x: INITX,
        y: INITY,
        id: this.componentCount,
        path: `${savefileRoot}`, // Path without the name of this file. Put /name behind this
      };
      // Create the init style of the component
      comp.c = (
        <Draggable
          id={this.componentCount}
          key={this.componentCount}
          cbWidth={this.props.cbWidth}
          rightBound={this.nodeRef.current.offsetWidth}
          bottomBound={this.nodeRef.current.offsetHeight}
          compType={this.props.compType}
          updateLayout={this.updateLayout}
          showCloseOptions={this.showCloseOptions}
          initX={INITX}
          initY={INITY}
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
      // Clone the element, since we need to pass the metadata to the draggable every time
      comp.c = React.cloneElement(comp.c, { initX: x, initY: y, name });
      return {
        exsistingComps: comps
      };
    }, () => {
      console.log('after update', this.state.exsistingComps);
      saveLayout(this.state.exsistingComps, this.componentCount);
    });
  }

  showCloseOptions(childId) {
    this.setState({
      idToBeDeleted: childId,
      showClose: true
    });
  }

  hideCloseOptions() {
    this.setState({ idToBeDeleted: null, showClose: false });
  }

  deleteIconAndFolder(deleteFolder = null) {
    this.setState((prevStat) => {
      const comps = [...prevStat.exsistingComps];
      // Find the right component according to id
      let i;
      for (i = 0; i < comps.length; i += 1) {
        if (comps[i].props.id === prevStat.idToBeDeleted) {
          if (deleteFolder) {
            // put your function here
            deleteFile(`${comps[i].props.path}/${comps[i].props.name}`);
          }
          break;
        }
      }
      // Delete the icon but not the content inside
      comps.splice(i, 1);
      return {
        exsistingComps: comps,
        idToBeDeleted: null,
        showClose: false
      };
    }, () => {
      saveLayout(this.state.exsistingComps, this.componentCount);
    });
  }

  handleChange(e) {
    console.log(this.state.exsistingComps);
    // Variable to hold the original version of the list name
    const currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];
    const tmp = [];
    // If the search bar isn't empty
    if (e.target.value !== '') {
      // Assign the original list to currentList
      for (let i = 0; i < this.state.exsistingComps.length; i += 1) {
        // push the conent to elements!
        currentList.push(this.state.exsistingComps[i].props.name);
      }
      console.log(currentList);
      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter((item) => {
        // change current item to lowercase
        const lc = item.toLowerCase();
        // change search term to lowercase
        const filter = e.target.value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return lc.includes(filter);
      });
      // set the searched flag to true, so it can only render the wanted
      for (let i = 0; i < newList.length; i += 1) {
        for (let j = 0; j < this.state.exsistingComps.length; j += 1) {
          // push the component to elements!
          if (newList[i] === this.state.exsistingComps[j].props.name) {
            tmp.push(this.state.exsistingComps[j]);
          }
        }
      }
      this.setState({ searched: true, searchedComps: tmp });
    } else {
      // set the searched flag to false, so it can render everything
      this.setState({ searched: false });
    }
  }

  render() {
    // Extract the exsisting components
    let r = [];
    if (!this.state.searched) {
      r = this.state.exsistingComps.map(comp => comp.c);
      console.log('inside render: ', r);
    } else {
      r = this.state.searchedComps.map(comp => comp.c);
      // console.log('search');
    }
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
                  onClick={this.deleteIconAndFolder}
                  ghost
                >
                  Only remove icon
                </Button>
                <Button
                  className="playground__btn--2"
                  type="danger"
                  onClick={() => this.deleteIconAndFolder(true)}
                  ghost
                >
                  Delete whole folder
                </Button>
                <Button
                  className="playground__cancel-btn"
                  type="dashed"
                  onClick={this.hideCloseOptions}
                  ghost
                >
                  Cancel
                </Button>
              </div>
            )
            : null
        }
        <input type="text" className="input" onChange={this.handleChange} placeholder="Search..." />
      </section>
    );
  }
}
