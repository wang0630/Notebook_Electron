import React from 'react';
import ReactQuill from 'react-quill';
import { Icon, Input } from 'antd';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import './text-editor.scss';

// configurations for quill text editor

export default class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '', theme: 'snow' }; // You can also pass a Quill Delta here
    this.textChange = this.textChange.bind(this);
  }

  textChange(content, delta, source, editor) {
    // content: text value
    // delta: the format quill used to recorded info
    // source: always 'user'
    // editor: including the editor api
    this.setState({ text: content });
  }

  themeChange(theme) {
    let newTheme = null;
    if (theme !== 'core') {
      newTheme = theme;
    }
    this.setState({ theme: newTheme });
  }

  render() {
    return (
      <div>
        <Input
          placeholder="Enter the name"
          // defaultValue=""
          size="small"
          onPressEnter={e => this.props.updateName(e.target.value)}
          style={{
            width: '50%'
          }}
        />
        <ReactQuill
          className="text-editor"
          theme={this.state.theme}
          value={this.state.text}
          placeholder="add new content here..."
          onChange={(content, delta, source, editor) => {
            this.textChange(content, delta, source, editor);
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
