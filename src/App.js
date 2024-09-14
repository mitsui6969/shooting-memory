import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Loginpage from "./pages/LoginPage";
import Toppage from "./pages/Toppage";
import CreateRoom from "./pages/CreateRoom";
import WaitRoom from "./pages/WaitRoom";
import ShootingScreen from "./pages/ShootingScreen";
import GameStart from "./pages/GameStart";
import FrameSelection from "./pages/FrameSelection";
import CollagePage from "./pages/CollagePage";
import EditFinPage from "./pages/EditFinPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login-page" element={<Loginpage />} />
        <Route path="/" element={<Toppage />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/wait-room" element={<WaitRoom />} />
        <Route path="/shooting-screen" element={<ShootingScreen />} />
        <Route path="/game-start" element={<GameStart />}/>
        <Route path="/frame-selection" element={<FrameSelection />} />
        <Route path="/collage-page" element={<CollagePage />} />
        <Route path="/edit-fin" element={<EditFinPage />} />
      </Routes>
    </Router>
  );
}

export default App;
