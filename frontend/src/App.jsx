import './App.css'
import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Nevber from './componet/Nevber'



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nevber />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App