/*global io*/
import React from 'react';
const socket = io("http://localhost:5000");

import AddStock from '../components/AddStock';
import StockChart from '../components/StockChart';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stocks: []
    }
  }

  componentDidMount() {
    socket.on('new stocks', (stocks) => {
      this.setState({
        stocks
      });
    })
  }


  render() {
    return (
      <div>
        <AddStock socket={socket}/>
        <StockChart socket={socket}/>
        <h1>{this.state.stocks}</h1>
      </div>
    );
  }
}
