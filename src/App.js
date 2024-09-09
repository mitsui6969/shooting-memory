import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Toppage from "./pages/Toppage";
import CreateRoom from "./pages/CreateRoom";
import WaitRoom from "./pages/WaitRoom";
import ShootingScreen from "./pages/ShootingScreen";
import GameStart from "./pages/GameStart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Toppage />} />
        <Route path="/createroom" element={<CreateRoom />} />
        <Route path="/waitroom" element={<WaitRoom />} />
        <Route path="/shooting-screen" element={<ShootingScreen />} />
        <Route path="/gamestart" element={<GameStart />}/>
      </Routes>
    </Router>
  );
}

export default App;
