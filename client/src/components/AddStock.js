import React from 'react';


export default class AddStock extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
  }

  handleSubmit() {
    this.socket.emit('add stock', {stock: 'AAPL'}, (data) => {
      console.log(data);
    })
  }
  
  render() {
    return (
      <div>
        <button onClick={this.handleSubmit.bind(this)}>Add AAPL</button>
      </div>
    );
  }
}
