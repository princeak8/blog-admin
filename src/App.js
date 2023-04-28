import { Route, Routes } from "react-router-dom";
import './App.css';

//Pages
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Login />} />
        <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
