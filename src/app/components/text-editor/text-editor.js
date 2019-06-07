import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

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
        <ReactQuill
          theme={this.state.theme}
          value={this.state.text}
          placeholder="add new content here..."
          onChange={(content, delta, source, editor) => {
            this.textChange(content, delta, source, editor);
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
