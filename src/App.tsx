import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Home } from './pages';

export const App: React.FC = () => {
  return (
    <Router>
      <div className='bg-hybackground min-h-screen'>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};
