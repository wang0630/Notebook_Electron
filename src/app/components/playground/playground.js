import React from 'react';
import { Button } from 'antd';
import Draggable from '../darggable/draggable';
import { saveLayout, loadLayout, deleteFile } from '../../helpers/fileOperation';
import savefileRoot from '../../constant/file-system-constants';
import './playground.scss';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

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
      // Create a new element
      const comp = {};
      // Create the props map
      comp.props = {
        compType: this.props.compType,
        compName: this.props.compName,
        name: 'yeenit',
        x: 300,
        y: 300,
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
        console.log(this.state.exsistingComps[0].props.name);
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
  handleChange(e) {

      // Variable to hold the original version of the list
      let currentList = [];
      // Variable to hold the filtered list before putting into state
      let newList = [];
      let t = [];
      // If the search bar isn't empty
      if (e.target.value !== "") {
          // Assign the original list to currentList
          let tt = [];
          for( let i=0; i< this.state.exsistingComps.length; i++){
            // push the conent to elements!
            tt.push(this.state.exsistingComps[i].props.name);
          }
          currentList = tt;
          console.log(currentList);
          // Use .filter() to determine which items should be displayed
          // based on the search terms
          newList = currentList.filter(item => {
            // change current item to lowercase
            let lc = item.toLowerCase();
            // change search term to lowercase
            let filter = e.target.value.toLowerCase();
            // check to see if the current list item includes the search term
            // If it does, it will be added to newList. Using lowercase eliminates
            // issues with capitalization in search terms and search content
            return lc.includes(filter);
          });
          // set the searched flag to true, so it can only render the wanted
          this.setState({
            searched: true,
            searchedComps : []
          }, () => {
            for(let i=0; i < newList.length; i++){
              for( let j = 0; j < this.state.exsistingComps.length; j++){
                // push the conent to elements!
                if(newList[i] == this.state.exsistingComps[j].props.name){
                  console.log('B4', this.state.exsistingComps);
                  t.push(this.state.exsistingComps[j]);
                  // this.state.searchedComps.push(this.state.exsistingComps[j]);
                  console.log('A4', this.state.exsistingComps);
                }
              }
            }
            this.setState({ searchedComps: t });
          });
          // console.log(this.state.searchedComps);
      } else {
        // set the searched flag to false, so it can render everything
        console.log('BB4', this.state.exsistingComps);
        this.setState({searched: false});
        console.log('AA4', this.state.exsistingComps);
      }
      // Set the filtered state based on what our rules added to newList
  }

  render() {
    // Extract the exsisting components
    let r = [];
    if(this.state.searched == 0){
      r = this.state.exsistingComps.map(comp => comp.c);
      console.log('all');
    }
    else{
      r = this.state.searchedComps.map(comp => comp.c);
      console.log('search');
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
