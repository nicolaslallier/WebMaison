import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Home from './pages/Home';
import FileManagement from './pages/FileManagement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/file-management" element={<FileManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 