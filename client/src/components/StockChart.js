import React from 'react';
import axios from 'axios';
import ReactHighstock from 'react-highcharts/dist/ReactHighstock';
import theme from '../styles/chartTheme';


import { API_STOCKS_URL } from '../constants/endpoints';

export default class StockChart extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    
    ReactHighstock.Highcharts.setOptions(theme);
    
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.fetchData();
    this.socket.on('new stocks', () => {
      this.fetchData();
    });
  }

  fetchData() {
    axios.get(API_STOCKS_URL)
      .then((d) => {
        this.setState({
          data: d.data.data
        })
      })
  }

  render() {
    var data = this.state.data;

    if (!data) {
      return (
        <h1>Data not loaded</h1>
      );
    }

    console.log(data);

    var config = {
      theme: theme,
      rangeSelector: {
        selected: 1
      },
      title: {
        text: 'STOCKS'
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
        valueDecimals: 2
      },
      series: data
    };

    return (
      <div>
        <ReactHighstock config={config} ref="chart"/>
      </div>
    );
  }
}
