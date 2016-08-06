/*global io*/
import React from 'react';
const socket = io('https://stockswatch-4iar.herokuapp.com/');

import AddStock from '../components/AddStock';
import StockChart from '../components/StockChart';
import StockCard from '../components/StockCard';
import '../styles/stocks.scss';
import '../styles/homepage.scss';


export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stocks: []
    };
  }

  componentDidMount() {
    socket.on('new stocks', (stocks) => {
      this.setState({
        stocks
      });
    });
  }


  render() {
    return (
      <div className="page-container">
        <AddStock socket={socket}/>
        <StockChart socket={socket}/>
        <div className="stock-item-container">
          {this.state.stocks.map((s) => {
            return (
              <StockCard key={s} socket={socket} symbol={s}/>
            );
          })}
        </div>
      </div>
    );
  }
}
