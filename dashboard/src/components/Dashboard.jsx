import { Component } from 'react';
import { MessageRepository } from '../repositories/messages';
import { DataService } from '../services/data-service';
import TimeLine from './plots/TimeLine';
import WordCloud from './plots/WordCloud';
import SunBurst from './plots/SunBurst';
import CustomMap from './maps/CustomMap';
import Details from './Details';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.repository = new MessageRepository();

    this.state = {
      messages: [],
      filters: {
        timeRange: {
          start: undefined,
          end: undefined,
        },
        location: {
          name: undefined,
          id: undefined,
        },
        cluster: {
          name: undefined,
          id: undefined,
        },
      },
      data: {
        wordCloud: [],
        sunburst: [],
        map: [],
      },
      layout: {
        page: 'OVERVIEW',
        map: {
          bottom: 0,
          left: '40vw',
          width: '60%',
        },
        wordCloud: {
          visible: true,
        },
        details: {
          visible: false,
        },
      },
    };
  }

  componentDidMount() {
    this.repository.getAll().then(async (res) => {
      this.setState({
        messages: res.data,
        data: {
          wordCloud: await DataService.getKeywords(res.data, []),
          sunburst: await DataService.getCluster(res.data, []),
          map: await DataService.getLocations(res.data, []),
        },
      });
    });
  }

  rangeUpdateHandler(start, end) {
    // setTimeRange({ start, end });
  }

  updateClusterHandler(name, id) {
    this.setState({
      filters: { ...this.state.filters, cluster: { name, id } },
    });
  }

  switchTab(name) {
    // switch (name) {
    //   case 'OVERVIEW':
    //     setLayout({
    //       ...layout,
    //       page: 'OVERVIEW',
    //       map: {
    //         bottom: 0,
    //         left: '40vw',
    //         width: '60%',
    //       },
    //       wordCloud: { visible: true },
    //       details: {
    //         visible: false,
    //       },
    //     });
    //     setSelectedLocation({
    //       start: undefined,
    //       end: undefined,
    //     });
    //     break;
    //   case 'MESSAGES':
    //     setLayout({
    //       ...layout,
    //       page: 'MESSAGES',
    //       map: {
    //         bottom: '35vh',
    //         left: '0vw',
    //         width: '40%',
    //       },
    //       wordCloud: { visible: false },
    //       details: {
    //         visible: true,
    //       },
    //     });
    //     break;
    //   default:
    //     console.log('Invalid tab name');
    // }
  }

  render() {
    return (
      <div className="dashboard">
        <div className="navigation">
          <h1>Visual Explorer</h1>
        </div>
        <div className="main-container">
          <div className="tabs">
            <button onClick={() => this.switchTab('OVERVIEW')}>Overview</button>
            <button onClick={() => this.switchTab('MESSAGES')}>Messages</button>
          </div>
          <div className="control">
            <WordCloud
              layout={this.state.layout}
              data={this.state.data.wordCloud}
            />
            <div className="sunburst" key="sunburst">
              <SunBurst
                data={this.state.data.sunburst}
                filters={this.state.filters}
                update={(name, id) => this.updateClusterHandler(name, id)}
              />
            </div>
          </div>

          {/* <CustomMap
            data={this.state.messages}
            timeRange={this.state.timeRange}
            selected={this.state.selectedLocation}
            layout={this.state.layout}
          />

          <Details
            layout={this.state.layout}
            data={this.state.messages}
            location={this.state.selectedLocation}
          /> */}
        </div>
        <div className="timeline">
          {/* <TimeLine
            data={this.state.messages}
            callback={this.rangeUpdateHandler}
            timeRange={this.state.timeRange}
          /> */}
        </div>
      </div>
    );
  }
}

export default Dashboard;
