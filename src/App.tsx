import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SetSchedulePage from './pages/SetSchedulePage'
import GoalCompleterPage from './pages/GoalCompleterPage'

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/set-schedule" element={<SetSchedulePage />} />
        <Route path="/goal-completer" element={<GoalCompleterPage />} />
      </Routes>
    </div>
  )
}

export default App