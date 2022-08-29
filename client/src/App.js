import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage";
import PreConversionChecklist from "./pages/ConversionChecklistPages/PreConversionChecklist/PreConversionChecklist";
import PostConversionChecklist from "./pages/ConversionChecklistPages/PostConversionChecklist/PostConversionChecklist";
import CreateOrModifyPreConversionChecklist from "./pages/ConversionChecklistPages/CreateOrModifyPreConversionChecklist";
import CreateOrModifyPostConversionChecklist from "./pages/ConversionChecklistPages/CreateOrModifyPostConversionChecklist";
import { ValidationErrorProvider } from "./pages/ConversionChecklistPages/Context/ValidationErrorContext";
// import CreatePreConversionChecklist from "./pages/ConversionChecklistPages/CreatePreConversionChecklist/CreatePreConversionChecklist";
// import ViewPreConversionChecklist from "./pages/ConversionChecklistPages/ViewPreConversionChecklist/ViewPreConversionChecklist";
// import CreatePostConversionChecklist from "./pages/ConversionChecklistPages/CreatePostConversionChecklist";
// import ViewPostConversionChecklist from "./pages/ConversionChecklistPages/ViewPostConversionChecklist";
// import ViewCompletedConversionChecklist from "./pages/ConversionChecklistPages/ViewCompletedConversionChecklist";
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
            {/* <Route exact path="/create-post-conversion-checklist" element={<CreatePostConversionChecklist />} />
          <Route exact path="/view-post-conversion-checklist" element={<ViewPostConversionChecklist />} />
          <Route exact path="/view-completed-conversion-checklist" element={<ViewCompletedConversionChecklist />} /> */}
          </Switch>
        </Router>
      </ValidationErrorProvider>
    </div>
  );
}

export default App;
