import React from "react";
import "./App.css";
import Chat from "./components/Chat";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import RoomCreate from "./components/RoomCreate";

const App = () => {
  return (
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => <RoomCreate {...props} />} />
          <Route path="/:roomName" render={(props) => <Chat {...props} />} />
        </Switch>
      </Router>
  );
};

export default App;
