import React from 'react';


export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>header</h1>
        {this.props.children}
      </div>
    );
  }
}
