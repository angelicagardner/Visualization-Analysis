import { Component } from 'react';
import Dashboard from './components/Dashboard';
import { MessageRepository } from './repositories/messages';
import './styles/app.scss';

class App extends Component {
  constructor() {
    super();
    this.state = { messages: [] };
    this.repository = new MessageRepository();
  }

  async loadData() {
    let data = (await this.repository.getAll()).data;
    this.setState({ messages: [...data] });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div className="app">
        <Dashboard messages={this.state.messages} />
      </div>
    );
  }
}

export default App;
