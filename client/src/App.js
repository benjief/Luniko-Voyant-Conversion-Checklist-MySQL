import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import PreConversionChecklist from "./pages/PreConversionChecklist";
import CreatePreConversionChecklist from "./pages/CreatePreConversionChecklist";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/pre-conversion-checklist" element={<PreConversionChecklist />} />
          <Route exact path="/create-pre-conversion-checklist" element={<CreatePreConversionChecklist />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
