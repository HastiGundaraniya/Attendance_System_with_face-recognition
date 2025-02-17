import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext'
import Home from './pages/Home';
import StuHome from './student/StuHome';
import ProfHome from './professor/ProfHome';

function App() {
  const { user } = useAuthContext()
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student" element={user ? <StuHome /> : <Home />} />
          <Route path="/professor" element={user ? <ProfHome /> : <Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
