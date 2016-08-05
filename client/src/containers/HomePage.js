/*global io*/
import React from 'react';
const socket = io("http://localhost:5000");

import AddStock from '../components/AddStock';

export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <AddStock socket={socket}/>
        <h1>Hello World!</h1>
      </div>
    );
  }
}
