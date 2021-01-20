import React from 'react';
import ReactDOM from 'react-dom';
import crass from 'crass';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "html {\n    color: blue;\n}",
    }
  }
  handleChange(str) {
    this.setState({ inputText: str });
  }
  render() {
    let minified_css = "";
    let minified_escaped_css = "";
    let can_generate_bookmarklet = false;
    try {
      let c = crass.parse(this.state.inputText);
      c.optimize();
      minified_css = c.toString();
      minified_escaped_css = minified_css.replace(/"/g,'\\"')
      can_generate_bookmarklet = true;
    } catch (error) {
      minified_css = "error";
    }
    if (can_generate_bookmarklet && minified_css.length !== 0) {
      let bookmarklet_code = `javascript:(function(){let s=document.createElement("style");s.innerText="${minified_escaped_css}";document.getElementsByTagName("head")[0].appendChild(s);})()`;
      return (
        <>
          <CSSInput value={this.state.inputText} handleChange={(str)=>this.handleChange(str)}></CSSInput>
          <Counter text={bookmarklet_code}></Counter>
          <a href={bookmarklet_code}>Apply Style: {minified_css}</a>
        </>
      );
    }
    return <><CSSInput value={this.state.inputText} handleChange={(str)=>this.handleChange(str)}></CSSInput><Counter></Counter></>;
  }
}

class CSSInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }
  handleChange(e) {
    this.setState({ value: e.target.value });
    this.props.handleChange(e.target.value);
  }
  handleKeyDown(e) {
    if (e.key === 'Tab' && e.keyCode !== 229) {
      e.preventDefault();

      const elm = e.target;

      const current = elm.value;

      const start = elm.selectionStart;
      const end = elm.selectionEnd;

      const space_num = 4;
      const spaces = Array(space_num + 1).join(' ');

      const next = current.substring(0, start) + spaces + current.substring(end, current.length);

      this.setState({
        value: next,
      }, () => {
        elm.setSelectionRange(start + space_num, start + space_num);
      });
    }
  }
  render() {
    return (
      <textarea rows={10} cols={50} value={this.state.value} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}></textarea>
    );
  }
}

function Counter(props) {
  if ("string" === typeof props.text) {
    return <section><span>length:</span>{props.text.length}</section>;
  } else {
    return <section><span>length:</span>error</section>;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
