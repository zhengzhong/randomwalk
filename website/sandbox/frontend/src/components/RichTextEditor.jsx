import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import Quill from 'quill';

import './style.scss';


const TOOLBAR_OPTIONS = [
  // Paragraph.
  [
    { header: [2, 3, false] },
    'bold',
    'italic',
    'underline',
    'blockquote',
  ],
  ['link', 'image'],
  // Lists.
  [
    { list: 'ordered' },
    { list: 'bullet' },
  ],
  // Colors.
  [
    { color: ['#000', '#f44336', '#3f51b5', '#ff9800', '#999'] },
    { background: ['#fff', '#ffcdd2', '#bbdefb', '#c8e6c9', '#ffecb3'] },
  ],
  // Clear format.
  ['clean'],
];


export default class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onFocusEditor = this.onFocusEditor.bind(this);
    this.onBlurEditor = this.onBlurEditor.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

  componentDidMount() {
    this.quill = new Quill(this.el, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });
    this._resetInitialHTML();
    this.quill.on('text-change', debounce(this.onTextChange, 500));
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this._resetInitialHTML();
    }
  }

  onFocusEditor() {
    if (this.quill) {
      this.quill.focus();
    }
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  onBlurEditor() {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  onTextChange() {
    if (this.quill === null) {
      console.log('Quill is not initialized.');
      return;
    }
    // See: https://github.com/quilljs/quill/issues/903
    const html = this.quill.root.innerHTML;
    this.props.onChange(html);
  }

  _resetInitialHTML() {
    this.quill.root.innerHTML = this.props.initialHTML || '';
    this.quill.update();
  }

  render() {
    const style = {
      minHeight: this.props.minHeight || '20rem',
    };
    return (
      <div
        ref={(el) => { this.el = el; }}
        className="quill-snow-overrides"
        style={style}
        role="presentation"
        onClick={this.onFocusEditor}
        onBlur={this.onBlurEditor}
      >
        {this.props.children}
      </div>
    );
  }
}


RichTextEditor.propTypes = {
  minHeight: PropTypes.string,
  initialHTML: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

RichTextEditor.defaultProps = {
  minHeight: null,
  initialHTML: null,
  onFocus: null,
  onBlur: null,
  children: null,
};
