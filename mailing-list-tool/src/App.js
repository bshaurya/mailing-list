import React from 'react';
import MailingListForm from './MailingListForm';

function App() {
  return(
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#000000',
      padding: '2rem'
    }}>
      <MailingListForm />
    </div>
  );
}

export default App;
