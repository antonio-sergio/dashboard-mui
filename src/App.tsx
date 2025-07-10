// src/App.tsx
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './Dashboard';
import Monitor1 from './pages/monitor1/Monitor1';
import Monitor2 from './pages/monitor2/Monitor2';
import Monitor5 from './pages/monitor5/Monitor5';
import Monitor6 from './pages/monitor6/Monitor6';
import Monitor4 from './pages/monitor4/Monitor4';
import Monitor3 from './pages/monitor3/Monitor3';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard></Dashboard>} />
        <Route path="/monitor1" element={<Dashboard><Monitor1 /></Dashboard>} />
        <Route path="/monitor2" element={<Dashboard><Monitor2 /></Dashboard>} />
        <Route path="/monitor3" element={<Dashboard><Monitor3 /></Dashboard>} />
        <Route path="/monitor4" element={<Dashboard><Monitor4 /></Dashboard>} />
        <Route path="/monitor5" element={<Dashboard><Monitor5 /></Dashboard>} />
        <Route path="/monitor6" element={<Dashboard><Monitor6 /></Dashboard>} />
        

      </Routes>
    </BrowserRouter>
  );
}
