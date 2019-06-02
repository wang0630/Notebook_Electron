import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow'

// configurations for quill text editor
var options = {
    debug: 'info',
    modules: {
      toolbar: '#toolbar'
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
};

export default class TextArea extends React.Component{
    constructor (props) {
        super(props);
        this.state = { text: '' } // You can also pass a Quill Delta here
        this.textChange = this.textChange.bind(this)
    }

    textChange(value) {
        this.setState({ text: value })
    }

    render() {
        return (
            <ReactQuill theme="bubble"
                        defaultValue="input some content here..."
                        value={this.state.text}
                        onChange={this.textChange} />
        );
    }
}