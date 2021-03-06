import React from 'react';
import { Button, Icon } from 'antd';
import Draggable from '../darggable/draggable';
import { saveLayout, loadLayout, deleteFile, readDir } from '../../helpers/fileOperation';
import { linearCollisionCheck, rTreeInsert, rTreeCollisionCheck } from '../../helpers/collisionCheck';
import savefileRoot from '../../constant/file-system-constants';
import './playground.scss';


const CloseOptions = ({ deleteIconAndFolder, hideCloseOptions }) => (
  <div className="playground__close">
    <p className="playground__warning">
      Do you want to remove icon or the whole folder?
    </p>
    <Button
      className="playground__btn--1"
      type="primary"
      onClick={() => deleteIconAndFolder(false)}
    >
      Only remove icon
    </Button>
    <Button
      className="playground__btn--2"
      type="danger"
      onClick={() => deleteIconAndFolder(true)}
    >
      Delete content
    </Button>
    <Button
      className="playground__cancel-btn"
      type="dashed"
      onClick={hideCloseOptions}
    >
      Cancel
    </Button>
  </div>
);


const NoteSelector = ({ children }) => {
  console.log(children);
  return (
    <div className="playground__notes-selector">
      { children }
    </div>
  );
};

export default class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idToBeDeleted: null,
      folderPathToOpen: null,
      exsistingComps: [],
      searchedComps: [],
      showClose: false,
      showNotes: false,
      searched: false
    };
    this.updateLayout = this.updateLayout.bind(this);
    this.showCloseOptions = this.showCloseOptions.bind(this);
    this.hideCloseOptions = this.hideCloseOptions.bind(this);
    this.deleteIconAndFolder = this.deleteIconAndFolder.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getFolderName = this.getFolderName.bind(this);
    this.showNotesSelector = this.showNotesSelector.bind(this);
    this.createNotesIcons = this.createNotesIcons.bind(this);
    this.createDraggable = this.createDraggable.bind(this);
    this.createFromPlayground = this.createFromPlayground.bind(this);
    this.createBrandNew = this.createBrandNew.bind(this);
    this.createFromExisting = this.createFromExisting.bind(this);
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
          getCBWidth={this.props.getCBWidth}
          rightBound={this.nodeRef.current.offsetWidth}
          bottomBound={this.nodeRef.current.offsetHeight}
          compType={item.compType}
          updateLayout={this.updateLayout}
          showCloseOptions={this.showCloseOptions}
          showNotesSelector={this.showNotesSelector}
          initX={item.x}
          initY={item.y}
          path={item.path}
        />
      );
      finalArr.push(comp);
      rTreeInsert(comp);
    });
    // Ready all components
    this.setState({
      exsistingComps: finalArr,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.shouldCreateDraggable && !prevProps.shouldCreateDraggable) {
      if (this.props.folderPath) {
        this.createFromExisting();
      } else {
        this.createBrandNew();
      }
    }

    if (!this.props.search_button_clicked && prevProps.search_button_clicked) {
      this.setState({ searched: false });
    }
  }

  createDraggable(compType, name, path) {
    const INITX = 300;
    const INITY = 300;
    // Create a new element
    const comp = {};
    // Create the props map
    comp.props = {
      compType: this.props.compType,
      name,
      x: INITX,
      y: INITY,
      id: this.componentCount,
      // path is the containing folder of the note(if it is a note)
      // path is the path of itself(if it is a dir)
      path
    };
    // Create the init style of the component
    comp.c = (
      <Draggable
        id={this.componentCount}
        key={this.componentCount}
        getCBWidth={this.props.getCBWidth}
        rightBound={this.nodeRef.current.offsetWidth}
        bottomBound={this.nodeRef.current.offsetHeight}
        compType={compType}
        updateLayout={this.updateLayout}
        showCloseOptions={this.showCloseOptions}
        showNotesSelector={this.showNotesSelector}
        initX={INITX}
        initY={INITY}
        name={comp.props.name}
        path={path}
      />
    );
    rTreeInsert(comp);
    this.setState(prevStat => (
      {
        exsistingComps: [...prevStat.exsistingComps, comp]
      }
    ), () => {
      this.props.clearShouldCreateDraggable();
      this.componentCount += 1;
    });
  }

  createFromPlayground(name) {
    this.createDraggable('text-area', name, this.state.folderPathToOpen);
  }

  createBrandNew() {
    this.createDraggable(this.props.compType, '', savefileRoot);
  }

  createFromExisting() {
    const name = this.getFolderName();
    const patharr = this.props.folderPath.split('/');
    patharr.splice(patharr.length - 2, 1);
    this.createDraggable('new-dir', name, patharr.join('/'));
  }

  getFolderName() {
    const fullPathArr = this.props.folderPath.split('/');
    console.log('name: ', fullPathArr);
    return fullPathArr[fullPathArr.length - 2];
  }

  // It is called when onMouseUp event is fired in draggable
  updateLayout({ x, y, name, id }) {
    console.log('before update', this.state.exsistingComps);


    // const colResult = linearCollisionCheck(this.state.exsistingComps, x, y, id);
    const comp2 = this.state.exsistingComps.find(item => item.props.id === id);
    const colResult = rTreeCollisionCheck(comp2, x, y, id);

    this.setState((prevStat) => {
      const comps = [...prevStat.exsistingComps];
      if (colResult === 1) {
        let i;
        for (i = 0; i < comps.length; i += 1) {
          if (comps[i].props.id === id) break;
        }
        comps.splice(i, 1);
        console.log('yee');
        return {
          exsistingComps: comps
        };
      }
      // Find the right component according to id
      const comp = comps.find(item => item.props.id === id);
      comp.props.x = x;
      comp.props.y = y;
      comp.props.name = name;
      // Clone the element, since we need to pass the metadata to the draggable every time
      comp.c = React.cloneElement(comp.c, { initX: x, initY: y, name });
      rTreeInsert(comp);
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

  showNotesSelector(id) {
    this.setState((prevStat) => {
      let path = '';
      let name = '';
      for (let i = 0; i < prevStat.exsistingComps.length; i += 1) {
        if (id === prevStat.exsistingComps[i].props.id) {
          // Note can't open this
          if (prevStat.exsistingComps[i].props.compType !== 'new-dir') {
            return;
          }
          ({ path, name } = prevStat.exsistingComps[i].props);
          break;
        }
      }
      return {
        showNotes: true,
        folderPathToOpen: `${path}${name}/`
      };
    });
  }

  deleteIconAndFolder(deleteContent) {
    this.setState((prevStat) => {
      const comps = [...prevStat.exsistingComps];
      // Find the right component according to id
      let i;
      for (i = 0; i < comps.length; i += 1) {
        if (comps[i].props.id === prevStat.idToBeDeleted) {
          if (deleteContent) { // put your function here
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

  createNotesIcons() {
    if (this.state.folderPathToOpen) {
      const notes = readDir(this.state.folderPathToOpen);
      const notesComp = notes.map(item => (
        <div
          key={item.item}
          className="playground__notes-selector__container"
          onDoubleClick={() => {
            if (item.isDir) {
              console.log('before update dir: ', this.state.folderPathToOpen);
              this.setState(prevStat => ({ folderPathToOpen: `${prevStat.folderPathToOpen}${item.item}/` }),
                () => {
                  console.log('after update dir: ', this.state.folderPathToOpen);
                });
            } else {
              this.createFromPlayground(item.item);
              this.setState({ showNotes: false });
            }
          }}
        >
          <Icon
            type={item.isDir ? 'folder-add' : 'form'}
            style={{
              fontSize: '20px',
            }}
          />
          <span className="playground__notes-selector__name">
            { item.item }
          </span>
        </div>
      ));
      return notesComp;
    }
    return null;
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
    } else {
      r = this.state.searchedComps.map(comp => comp.c);
    }
    return (
      <section
        className="playground"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            this.setState({ showNotes: false, folderPathToOpen: '' });
          }
        }}
        ref={this.nodeRef}
      >
        { r }
        {
          this.state.showClose
            ? (
              <CloseOptions
                deleteIconAndFolder={this.deleteIconAndFolder}
                hideCloseOptions={this.hideCloseOptions}
              />
            )
            : null
        }
        {
          this.state.showNotes
            ? (
              <NoteSelector>
                { this.createNotesIcons() }
              </NoteSelector>
            )
            : null
        }
        {this.props.search_button_clicked ? <input type="text" className="input" onChange={this.handleChange} placeholder="Search..." /> : null}
      </section>
    );
  }
}
