import { BrowserRouter , Routes, Route } from 'react-router-dom';
import AddSignup from './pages/AddSignup';
import AddAttendance from './pages/AddAttendance';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AddSignup />} />
          <Route path="/addAttendance" element={<AddAttendance />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
