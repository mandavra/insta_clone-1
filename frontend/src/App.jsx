import './App.css'
import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Nevber from './componet/Nevber'
import SignIn from './componet/SignIn'
import SignUp from './componet/SignUp'



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nevber />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App