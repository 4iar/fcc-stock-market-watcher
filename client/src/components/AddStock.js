import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import '../styles/fab.scss'


export default class AddStock extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.stockToAdd = '';
    this.errorStockSymbol = '';

    this.state = {
      error: '',
      open: false
    };
  }

  componentDidMount() {
    this.socket.on('add stock error', (error) => {
      this.errorStockSymbol = error.stock
      this.setState({
        error: error.error,
      });
    })
    
    this.socket.on('add stock success', () => {
      this.setState({
        error: '',
        open: false
      });
    })
  }

  handleSubmit() {
    this.socket.emit('add stock', {stock: this.stockToAdd}, (data) => {
      console.log(data);
    })
  }

  handleChange(e) {
    this.stockToAdd = e.target.value;
    
    // remove the error message when the stock is changed
    console.log(this.stockToAdd);
    console.log(this.errorStockSymbol);
    if (this.stockToAdd !== this.errorStockSymbol) {
      console.log("changed from err");
      this.setState({
        error: ''
      });
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    return (
      <div>
        <Dialog
          title="Add a new stock"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >

          <TextField
            onChange={this.handleChange.bind(this)}
            floatingLabelText="Enter a stock symbol"
            errorText={this.state.error}
          />
          <FlatButton onClick={this.handleSubmit.bind(this)} label="Add" primary={true} />

        </Dialog>

        <FloatingActionButton className="fab" mini={true} onClick={this.handleOpen}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}
