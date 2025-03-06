import { Route, Routes } from "react-router"

import Dashboard from "./pages/Dashboard"
import PSINavbar from "./components/PSINavbar"
import { useState } from "react"

import Home from "./pages/Home"
import About from "./pages/About"
import PSBox from "./pages/PSBox"

export default function App() {

  const [userInfo] = useState({ name: 'Hi guest' })

  return (
    <div>

      <PSINavbar />
      <Routes>
        <Route index element={<Home userInfo={userInfo} />} />
        <Route path="dashboard" element={<Dashboard userInfo={userInfo} />} >
          <Route index element={<Home userInfo={userInfo} />} />

          <Route path="about" element={<About />} />
          <Route path="psbox-page" element={<PSBox userInfo={userInfo} />} />
          <Route path="*" element={<Dashboard userInfo={userInfo} />} />
        </Route>
        <Route>
          <Route path="*" element={<Dashboard userInfo={userInfo} />} />
        </Route>
      </Routes>
    </div>
  )
}