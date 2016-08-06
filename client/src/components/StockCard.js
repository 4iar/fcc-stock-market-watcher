import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import '../styles/stocks.scss';


export default class StockCard extends React.Component {
  render() {
    return (
      <Card className="stock-item">
        <CardHeader className="header" title={this.props.symbol}/>
        <CardActions className="buttons-container">
          <FlatButton primary={true} label="Info" />
          <FlatButton secondary={true} label="Delete" />
        </CardActions>
      </Card>
    );
  }
}
