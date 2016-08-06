import React from 'react';
import ReactHighstock from 'react-highcharts/dist/ReactHighstock';
import theme from '../styles/chartTheme';


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
    this.socket.on('new stocks data', (data) => {
      this.setState({
        data: data.data
      })
    });
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
