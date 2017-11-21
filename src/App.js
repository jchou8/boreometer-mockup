import React, { Component } from 'react';
import './App.css';
import logo from './logo.png';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, ButtonGroup, Row, Col, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import { BarChart, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const labels = ['Very bored', 'Bored', 'Neutral', 'Engaged', 'Very engaged'];
let EXAMPLE_DATA = [];

for (let i = 0; i < Math.floor(Math.random() * 30) + 30; i++) {
  EXAMPLE_DATA[i] = Math.floor(Math.random() * 5) + 1;
}
let numOnline = Math.floor(EXAMPLE_DATA.length * (1 + Math.random() * 1.5));

const ROOMS = [
  {
    name: 'INFO 343',
    code: 'info343',
    last: '2017-11-16'
  },
  {
    name: 'INFO 445',
    code: 'info445',
    last: '2017-11-21'
  }
]

let lineChartValues = [];
let curAvg = 3;
let curUsers = 60;

for (let i = 0; i < 48; i++) {
  let minute = i < 10 ? '0' + i : i;

  curAvg += Math.random() - 0.5;
  if (curAvg < 1) {
    curAvg = 1;
  } else if (curAvg > 5) {
    curAvg = 5;
  }

  curUsers += (Math.floor(Math.random() * 5) - 2);
  if (curUsers < 0) {
    curUsers = 0;
  }

  lineChartValues.push({
    time: '12:' + minute,
    avg: Math.round(curAvg * 100) / 100,
    users: curUsers
  });
}


function renderTooltip(props) {
  return (<div className="bar-tooltip">
    {labels[props.label - 1]}
    <br />
    {props.payload[0] && "Count: " + props.payload[0].value}
  </div>);
}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path='/' component={splashScreen} />
            <Route path='/login' component={loginScreen} />
            <Route path='/register' component={registerScreen} />
            <Route path='/room/:roomCode' component={audienceView} />
            <Route path='/presenter' component={presenterDashboard} />
            <Route path='/presenterview' component={presenterView} />
            <Route path='/create' component={createRoom} />
            <Route path='/details' component={roomDetails} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

class splashScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleFormChange(event) {
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  render() {
    let validRoomCode = !this.state.roomCode;

    return (
      <div>
        <header className="App-header page-header">
          <h1 className="App-title"><img src={logo} className="App-logo" alt="logo" />BOREOMETER</h1>
        </header>

        <div className="container">
          <div className="audience-splash">
            <h2>Audience</h2>
            <Form>
              <FormGroup>
                <Label for="roomCode">Join a room</Label>
                <Input
                  type="text"
                  name="roomCode"
                  id="roomCode"
                  placeholder="Enter room code"
                  valid={!validRoomCode}
                  onChange={(e) => this.handleFormChange(e)}></Input>
              </FormGroup>
              <Link to={"/room/" + this.state.roomCode}>
                <Button color="primary" disabled={validRoomCode}>
                  <i className="fa fa-arrow-circle-right" aria-hidden="true"></i> Join
              </Button>
              </Link>
            </Form>
          </div>

          <div className="presenter-splash">
            <h2>Presenters</h2>
            <Link to="/login">
              <Button color="primary">
                <i className="fa fa-sign-in" aria-hidden="true"></i> Login
              </Button>
            </Link>{' '}
            <Link to="/register">
              <Button color="primary">
                <i className="fa fa-user-plus" aria-hidden="true"></i> Register
            </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

class loginScreen extends Component {
  render() {
    return (
      <div>
        <header className="App-header page-header">
          <Link to="/" className="float-left">
            <Button color="secondary">
              <i className="fa fa-arrow-circle-left" aria-hidden="true"></i> Back
          </Button>
          </Link>

          <h1 className="App-title">Presenter Login</h1>
        </header>

        <div className="container">
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" placeholder="example@example.com" />

              <Label for="password">Password</Label>
              <Input type="password" name="password" id="password" />
            </FormGroup>
            <Link to={"/presenter"}>
              <Button color="primary">
                <i className="fa fa-sign-in" aria-hidden="true"></i> Login
              </Button>
            </Link>{' '}

            <Button color="info">
              <i className="fa fa-question-circle" aria-hidden="true"></i> Forgot password?
              </Button>
          </Form>
        </div>
      </div>
    );
  }
}

class registerScreen extends Component {
  render() {
    return (
      <div>
        <header className="App-header page-header">
          <Link to="/" className="float-left">
            <Button color="secondary">
              <i className="fa fa-arrow-circle-left" aria-hidden="true"></i> Back
          </Button>
          </Link>

          <h1 className="App-title">Register</h1>
        </header>

        <div className="container">
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" placeholder="example@example.com" />

              <Label for="password">Password</Label>
              <Input type="password" name="password" id="password" />

              <Label for="passwordConfirm">Confirm password</Label>
              <Input type="password" name="passwordConfirm" id="passwordConfirm" />
            </FormGroup>
            <Link to={"/presenter"}>
              <Button color="primary">
                <i className="fa fa-user-plus" aria-hidden="true"></i> Register
              </Button>
            </Link>
          </Form>
        </div>
      </div>
    );
  }
}

class audienceView extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let chartValues = [
      { level: 1, Count: 0 },
      { level: 2, Count: 0 },
      { level: 3, Count: 0 },
      { level: 4, Count: 0 },
      { level: 5, Count: 0 }
    ]

    for (let i = 0; i < EXAMPLE_DATA.length; i++) {
      chartValues[EXAMPLE_DATA[i] - 1].Count++;
    }

    let numResponses = EXAMPLE_DATA.length;
    let avgResponse = parseFloat(Math.round(EXAMPLE_DATA.reduce((sum, val) => sum + val) / numResponses * 100) / 100).toFixed(2);

    return (
      <div>
        <header className="App-header page-header">
          <Link to="/" className="float-left">
            <Button color="secondary">
              <i className="fa fa-arrow-circle-left" aria-hidden="true"></i> Leave room
            </Button>
          </Link>

          <h1 className="App-title">{this.props.match.params.roomCode}</h1>
        </header>
        <div className="container audience-app-area">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartValues}>
              <XAxis dataKey="level" type="number" domain={[0.5, 5.5]} ticks={[1, 2, 3, 4, 5]} />
              <YAxis />
              <Tooltip content={renderTooltip} />
              <Bar dataKey="Count" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>

          <Row className="audience-stats">
            <Col xs="4">
              <strong>{numOnline}</strong> users connected
            </Col>
            <Col xs="4">
              <strong>{numResponses}</strong> responses received
            </Col>
            <Col xs="4">
              <strong>{avgResponse}</strong> average
            </Col>
          </Row>

          {!this.state.rating &&
            <h2>How engaged are you right now?</h2>
          }

          {this.state.rating &&
            <h2>Thanks for voting! You can change your vote at any time.</h2>
          }

          <ButtonGroup className="rating-buttons">
            <Button color="danger" onClick={() => this.onRadioBtnClick(1)} active={this.state.rating === 1}><p className="rating-button">1</p>Very bored</Button>
            <Button color="warning" onClick={() => this.onRadioBtnClick(2)} active={this.state.rating === 2}><p className="rating-button">2</p>Bored</Button>
            <Button color="secondary" onClick={() => this.onRadioBtnClick(3)} active={this.state.rating === 3}><p className="rating-button">3</p>Neutral</Button>
            <Button color="info" onClick={() => this.onRadioBtnClick(4)} active={this.state.rating === 4}><p className="rating-button">4</p>Engaged</Button>
            <Button color="success" onClick={() => this.onRadioBtnClick(5)} active={this.state.rating === 5}><p className="rating-button">5</p>Very engaged</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }

  onRadioBtnClick(rating) {
    if (this.state.rating) {
      EXAMPLE_DATA.pop();
    }
    EXAMPLE_DATA.push(rating);

    this.setState({ rating: rating });
  }
}

class presenterDashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    let rooms = ROOMS.map((room) => {
      return (
        <Card>
          <CardBody>
            <CardTitle>{room.name}</CardTitle>
            <CardSubtitle>Room code: {room.code}</CardSubtitle>
            <CardText>Last presented {room.last}</CardText>

            <Link to={"/presenterview"}>
              <Button color="success">
                <i className="fa fa-play" aria-hidden="true"></i> Start
              </Button>
            </Link>{' '}
            <Link to={"/roomdetails"}>
              <Button color="info">
                <i className="fa fa-line-chart" aria-hidden="true"></i> Details
              </Button>
            </Link>{' '}
            <Button color="danger">
              <i className="fa fa-trash" aria-hidden="true"></i> Delete
            </Button>
          </CardBody>
        </Card>
      );
    });

    return (
      <div>
        <header className="App-header page-header">
          <Link to="/" className="float-left">
            <Button color="secondary">
              <i className="fa fa-sign-out" aria-hidden="true"></i> Sign Out
          </Button>
          </Link>

          <h1 className="App-title">Presenter Dashboard</h1>

          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={() => { this.toggle() }} className="float-right">
            <DropdownToggle caret color="success">
              Create Room
            </DropdownToggle>
            <DropdownMenu>
              <Link to="/create">
                <DropdownItem>Single-use room</DropdownItem>
              </Link>
              <Link to="/create">
                <DropdownItem>Multi-use room</DropdownItem>
              </Link>
            </DropdownMenu>
          </ButtonDropdown>
        </header>

        <div className="container">
          {rooms}
        </div>
      </div>
    );
  }
}

class presenterView extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    let chartValues = [
      { level: 1, Count: 0 },
      { level: 2, Count: 0 },
      { level: 3, Count: 0 },
      { level: 4, Count: 0 },
      { level: 5, Count: 0 }
    ]

    for (let i = 0; i < EXAMPLE_DATA.length; i++) {
      chartValues[EXAMPLE_DATA[i] - 1].Count++;
    }

    let numResponses = EXAMPLE_DATA.length;
    let avgResponse = parseFloat(Math.round(EXAMPLE_DATA.reduce((sum, val) => sum + val) / numResponses * 100) / 100).toFixed(2);

    return (
      <div>
        <header className="App-header page-header">
          {!this.state.stopped &&
            <Button color="secondary" className="float-left" onClick={() => this.setState({ stopped: true })}>
              <i className="fa fa-stop" aria-hidden="true"></i> Stop
          </Button>
          }

          {this.state.stopped &&
            <Link to="/presenter" className="float-left">
              <Button color="secondary">
                <i className="fa fa-arrow-circle-left" aria-hidden="true"></i> Leave Room
                </Button>
            </Link>
          }

          {this.state.stopped &&
            <Button color="info" className="float-right">
              <i className="fa fa-download" aria-hidden="true"></i> Download Data
            </Button>
          }

          <h1 className="App-title">INFO 343</h1>
        </header>

        <div className="container">

          <div className="room-status text-center">
            {!this.state.stopped &&
              <span>Room code: <strong>info343</strong><br />Open for 47 minutes</span>
            }

            {this.state.stopped &&
              <span>The room has been closed.</span>
            }
          </div>

          <Row className="text-center">
            <Col xs="6">
              <h2>Average engagement over time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartValues}>
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" domain={[1, 5]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" dataKey="avg" dot={false} stroke="#1e88e5" />
                  <Line yAxisId="right" dataKey="users" dot={false} stroke="#5e35b1" />
                </LineChart>
              </ResponsiveContainer>
            </Col>

            <Col xs="6">
              <h2>Current engagement</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartValues}>
                  <XAxis dataKey="level" type="number" domain={[0.5, 5.5]} ticks={[1, 2, 3, 4, 5]} />
                  <YAxis />
                  <Tooltip content={renderTooltip} />
                  <Bar dataKey="Count" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </Col>
          </Row>

          <Row className="audience-stats">
            <Col xs="4">
              <strong>{numOnline}</strong> users connected
            </Col>
            <Col xs="4">
              <strong>{numResponses}</strong> responses received
            </Col>
            <Col xs="4">
              <strong>{avgResponse}</strong> average
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

class createRoom extends Component {
  render() {
    return (
      <div>
        <header className="App-header page-header">
          <Link to="/presenter" className="float-left">
            <Button color="secondary">
              <i className="fa fa-arrow-circle-left" aria-hidden="true"></i> Back
          </Button>
          </Link>

          <h1 className="App-title">Create Room</h1>
        </header>

        <div className="container">
          <Form>
            <FormGroup>
              <Label for="roomCode">Room Code</Label>
              <Input type="text" name="roomCode" id="roomCode" placeholder="cool-nice-123" />

              <Label for="roomName">Room Name</Label>
              <Input type="text" name="roomName" id="roomName" placeholder="Cool and Good" />
            </FormGroup>
            <Link to={"/presenterview"}>
              <Button color="primary">
                <i className="fa fa-user-plus" aria-hidden="true"></i> Create
              </Button>
            </Link>
          </Form>
        </div>
      </div>
    );
  }
}

class roomDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <header className="App-header page-header">
          <Link to="/presenter" className="float-left">
            <Button color="secondary">
              <i className="fa fa-arrow-circle-left" aria-hidden="true"></i> Back
          </Button>
          </Link>

          <Button color="info" className="float-right">
            <i className="fa fa-download" aria-hidden="true"></i> Download Data
            </Button>

          <h1 className="App-title">History - INFO 343</h1>
        </header>

        <div className="container">
          placeholder woaww
        </div>
      </div>
    );
  }
}
export default App;
