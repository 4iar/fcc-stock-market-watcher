import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
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
    console.log("deleting " + this.props.symbol);
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
          <FlatButton primary={true} label="Info" />
          <FlatButton disabled={this.state.deleteDisabled} onClick={this.handleDelete.bind(this)} secondary={true} label="Delete" />
        </CardActions>
      </Card>
    );
  }
}
