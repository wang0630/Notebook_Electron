import React from 'react';
import ReactQuill from 'react-quill';
import { Icon, Input } from 'antd';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import './text-editor.scss';
import { saveFile, readFile } from '../../helpers/fileOperation';

// configurations for quill text editor

export default class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: readFile(this.props.filename),
      theme: 'snow'
    };
    this.textChange = this.textChange.bind(this); // handle the change of the content of notes
    this.rename = this.rename.bind(this); // the listener when file name is clicked
    this.renaming = false; // flag recording the state of renaming the file name
  }

  textChange(content, delta, source, editor) {
    // content: text value
    // delta: the format quill used to recorded info
    // source: always 'user'
    // editor: including the editor api
    this.setState({ text: content });
    // this.setState({ text: editor.getContents() });
    //    prob: losing focus
    //    errmsg: addRange(): The given range isn't in document.
    editor.getContents().ops.forEach(item => console.log(item.insert));

    saveFile(this.props.filename, content);
  }

  // change the theme of notes
  themeChange(theme) {
    let newTheme = null;
    if (theme !== 'core') {
      newTheme = theme;
    }
    this.setState({ theme: newTheme });
  }

  // rename the filename of named notes
  rename() {
    this.renaming = true;
  }

  // update the filename of notes
  updateName(value) {
    console.log('this filename is updated');
    this.props.updateName(value);
    this.renaming = false;
  }

  render() {
    return (
      <div className="container">
        {
          this.props.filename && !this.renaming
            ? (
              <span
                className="filename"
                onMouseDown={this.rename}
              >
                {this.props.filename}
              </span>
            )
            : (
              <Input
                className="filename"
                placeholder="Enter the name"
                defaultValue={this.props.filename}
                size="small"
                onPressEnter={e => this.updateName(e.target.value)}
                style={{
                  width: '100%'
                }}
              />
            )
        }
        <ReactQuill
          className="text-editor"
          theme={this.state.theme}
          value={this.state.text}
          placeholder="add new content here..."
          onChange={(content) => {
            this.textChange(content);
          }}
        />
        <Icon
          type="close-circle"
          theme="filled"
          onClick={this.props.onCloseClick}
          style={{
            fontSize: '20px',
            position: 'absolute',
            top: '0%',
            right: '0%'
          }}
        />
        <div className="themeSwitcher">
          <span> Theme </span>
          <select onChange={e => this.themeChange(e.target.value)}>
            <option value="snow">Snow</option>
            <option value="bubble">Bubble</option>
            <option value="core">Core</option>
          </select>
        </div>
      </div>
    );
  }
}
