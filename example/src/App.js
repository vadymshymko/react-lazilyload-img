import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LazilyLoadImg from 'reactjs-lazilyload-img';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p style={{
            marginBottom: '1500px'
          }}>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>

          <LazilyLoadImg
            placeholderSrc="//images.unsplash.com/photo-1539250632877-c12b7d5d6fcb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a608a96e849db36a32bcd68fa7bbd3ec&auto=format&fit=crop&w=27&q=8"
            src="//images.unsplash.com/photo-1539250632877-c12b7d5d6fcb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a608a96e849db36a32bcd68fa7bbd3ec&auto=format&fit=crop"
            style={{
              width: '500px',
              height: 'auto'
            }}
          />
        </header>
      </div>
    );
  }
}

export default App;
