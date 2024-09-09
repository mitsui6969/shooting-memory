import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Toppage from "./pages/Toppage";
import CreateRoom from "./pages/CreateRoom";
import WaitRoom from "./pages/WaitRoom";
import ShootingScreen from "./pages/ShootingScreen";
import FrameSelection from "./pages/FrameSelection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Toppage />} />
        <Route path="/createroom" element={<CreateRoom />} />
        <Route path="/waitroom" element={<WaitRoom />} />
        <Route path="/shooting-screen" element={<ShootingScreen />} />
        <Route path="/frame-selection" element={<FrameSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
