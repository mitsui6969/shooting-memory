import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Toppage from "./pages/Toppage";
import CreateRoom from "./pages/CreateRoom";
import WaitRoom from "./pages/WaitRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Toppage />} />
        <Route path="/createroom" element={<CreateRoom />} />
        <Route path="/waitroom" element={<WaitRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
