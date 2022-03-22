import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import PreConversionChecklist from "./pages/PreConversionChecklist";
import PostConversionChecklist from "./pages/PostConversionChecklist";
import CreatePreConversionChecklist from "./pages/CreatePreConversionChecklist";
import ViewPreConversionChecklist from "./pages/ViewPreConversionChecklist";
import CreatePostConversionChecklist from "./pages/CreatePostConversionChecklist";
import ViewPostConversionChecklist from "./pages/ViewPostConversionChecklist";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/pre-conversion-checklist" element={<PreConversionChecklist />} />
          <Route exact path="/post-conversion-checklist" element={<PostConversionChecklist />} />
          <Route exact path="/create-pre-conversion-checklist" element={<CreatePreConversionChecklist />} />
          <Route exact path="/view-pre-conversion-checklist" element={<ViewPreConversionChecklist />} />
          <Route exact path="/create-post-conversion-checklist" element={<CreatePostConversionChecklist />} />
          <Route exact path="/view-post-conversion-checklist" element={<ViewPostConversionChecklist />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
