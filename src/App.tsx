import { BrowserRouter } from 'react-router-dom'
import './App.css'
// import WeatherCard from './components/WeatherCard'
import HomePage from './pages/HomePage'
import Contact from './pages/Contact'
import { Route,Routes } from 'react-router-dom'
import About from './pages/About'

function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/about' element={<About/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
