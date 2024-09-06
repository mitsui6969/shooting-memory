import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Toppage from "./pages/Toppage";
import CreateRoom from "./pages/CreateRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Toppage />} />
        <Route path="/createroom" element={<CreateRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
