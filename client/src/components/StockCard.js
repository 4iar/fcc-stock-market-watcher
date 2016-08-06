import React from 'react';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import '../styles/stocks.scss';


export default class StockCard extends React.Component {
  constructor(props) {
    super(props);
    
    this.socket = this.props.socket;
    
    this.state = {
      deleteDisabled: false
    };
  }
  
  handleDelete() {
    this.socket.emit('delete stock', {stock: this.props.symbol});
    
    this.setState({
      deleteDisabled: true
    });
  }
  
  
  render() {
    return (
      <Card className="stock-item">
        <CardHeader className="header" title={this.props.symbol}/>
        <CardActions className="buttons-container">
          <FlatButton target="_blank" href={"https://uk.finance.yahoo.com/q?s=" + this.props.symbol} primary={true} label="Info" />
          <FlatButton disabled={this.state.deleteDisabled} onClick={this.handleDelete.bind(this)} secondary={true} label="Delete" />
        </CardActions>
      </Card>
    );
  }
}
