import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MailingListForm from './MailingListForm';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={
            <div style={{ 
              minHeight: '100vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '2rem'
            }}>
              <MailingListForm />
            </div>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
