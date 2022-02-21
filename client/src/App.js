import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" element={<LandingPage />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
