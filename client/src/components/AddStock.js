import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';


export default class AddStock extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.stockToAdd = '';
  }

  handleSubmit() {
    this.socket.emit('add stock', {stock: this.stockToAdd}, (data) => {
      console.log(data);
    })
  }

  handleChange(e) {
    this.stockToAdd = e.target.value;
  }

  render() {
    return (
      <div>
        <TextField onChange={this.handleChange.bind(this)} floatingLabelText="Enter a stock symbol" />
        <FlatButton onClick={this.handleSubmit.bind(this)} label="Add" primary={true} />
      </div>
    );
  }
}
