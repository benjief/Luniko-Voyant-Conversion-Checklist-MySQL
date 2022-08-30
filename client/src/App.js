import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage";
import PreConversionChecklist from "./pages/ConversionChecklistPages/PreConversionChecklist/PreConversionChecklist";
import PostConversionChecklist from "./pages/ConversionChecklistPages/PostConversionChecklist/PostConversionChecklist";
import CreateOrModifyPreConversionChecklist from "./pages/ConversionChecklistPages/CreateOrModifyPreConversionChecklist";
import CreateOrModifyPostConversionChecklist from "./pages/ConversionChecklistPages/CreateOrModifyPostConversionChecklist";
import ViewConversionChecklist from "./pages/ConversionChecklistPages/ViewConversionChecklist/ViewConversionChecklist";
import { ValidationErrorProvider } from "./pages/ConversionChecklistPages/Context/ValidationErrorContext";
import './App.css';

function App() {
  return (
    <div className="App">
      <ValidationErrorProvider>
        <Router>
          <Switch>
            <Route exact path="/" element={<LandingPage />} />
            <Route exact path="/pre-conversion-checklist" element={<PreConversionChecklist />} />
            <Route exact path="/post-conversion-checklist" element={<PostConversionChecklist />} />
            <Route exact path="/create-or-modify-pre-conversion-checklist/:pageFunctionality" element={<CreateOrModifyPreConversionChecklist />} />
            <Route exact path="/create-or-modify-post-conversion-checklist/:pageFunctionality" element={<CreateOrModifyPostConversionChecklist />} />
            <Route exact path="/view-conversion-checklist" element={<ViewConversionChecklist />} />
          </Switch>
        </Router>
      </ValidationErrorProvider>
    </div>
  );
}

export default App;
