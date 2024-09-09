import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Toppage from "./pages/Toppage";
import CreateRoom from "./pages/CreateRoom";
import WaitRoom from "./pages/WaitRoom";
import ShootingScreen from "./pages/ShootingScreen";
import GameStart from "./pages/GameStart";
import FrameSelection from "./pages/FrameSelection";
import CollagePage from "./pages/CollagePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Toppage />} />
        <Route path="/createroom" element={<CreateRoom />} />
        <Route path="/waitroom" element={<WaitRoom />} />
        <Route path="/shooting-screen" element={<ShootingScreen />} />
        <Route path="/gamestart" element={<GameStart />}/>
        <Route path="/frame-selection" element={<FrameSelection />} />
        <Route path="/collage-page" element={<CollagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
