// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import WorkBoardsPage from './components/WorkBoardsPage';
import CreateWorkBoardPage from './components/CreateWorkBoardPage';
import WorkBoardDetailPage from './components/WorkBoardDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/boards" element={<WorkBoardsPage />} />
        <Route path="/create-board" element={<CreateWorkBoardPage />} />
        <Route path="/board/:id" element={<WorkBoardDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;