import React, { useState } from 'react';
import { supabase } from './supabase';

const MailingListForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email){
      return;
    }

    setStatus('submitting');

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ 
          email: email.toLowerCase().trim(),
          user_agent: navigator.userAgent
        }]);

      if (error) {
        if(error.code === '23505'){
          setStatus('duplicate');
        }
        else {
          throw error;
        }
      }
      else {
        setStatus('success');
        setEmail('');
      }
    }
    catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
    }
  };

  const styles ={
    container: {
      maxWidth: '450px',
      margin: '0 auto',
      padding: '3rem 2rem',
      fontFamily: 'Monaco,"Lucida Console", monospace',
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '1px solid #333333',
      textAlign: 'left'
    },
    header:{
      marginBottom: '2rem',
      borderBottom: '1px solid #333333',
      paddingBottom: '1rem'
    },
    prompt: {
      fontSize: '0.9rem',
      color: '#00ff00',
      marginBottom: '0.5rem',
      fontFamily: 'Monaco,"Lucida Console", monospace'
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '400',
      marginBottom: '1rem',
      color: '#ffffff',
      fontFamily: 'Monaco,"Lucida Console", monospace'
    },
    subtitle: {
      fontSize: '0.95rem',
      color: '#cccccc',
      lineHeight: '1.6',
      marginBottom: '0'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputLabel:{
      fontSize: '0.9rem',
      color: '#00ff00',
      marginBottom: '0.5rem',
      fontFamily: 'Monaco,"Lucida Console", monospace'
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      fontSize: '1rem',
      border: '1px solid #333333',
      backgroundColor: '#111111',
      color: '#ffffff',
      outline: 'none',
      fontFamily: 'Monaco,"Lucida Console", monospace',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease'
    },
    button: {
      padding: '0.8rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '400',
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '1px solid #ffffff',
      cursor: 'pointer',
      fontFamily: 'Monaco,"Lucida Console", monospace',
      transition: 'all 0.2s ease',
      textTransform: 'lowercase'
    },
    message: {
      padding: '0.8rem',
      fontSize: '0.9rem',
      marginTop: '1rem',
      fontFamily: 'Monaco,"Lucida Console", monospace',
      border: '1px solid #333333'
    },
    success: {
      backgroundColor: '#001100',
      color: '#00ff00',
      borderColor: '#00ff00'
    },
    error:{
      backgroundColor: '#110000',
      color: '#ff0000',
      borderColor: '#ff0000'
    },
    duplicate: {
      backgroundColor: '#111100',
      color: '#ffff00',
      borderColor: '#ffff00'
    }
  };

  return(
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.prompt}>shaurya@terminal:~$</div>
        
        <h1 style={styles.title}>./mailing-list</h1>

        <p style={styles.subtitle}>
          Subscribe for updates, insights, and exclusive content.<br/>
          No spam. Unsubscribe anytime.
        </p>

      </div>
      <form onSubmit={handleSubmit} style={styles.form}>

        <div>
          <div style={styles.inputLabel}>email:</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@yourdomain.com"

            style={{
              ...styles.input,
              borderColor: email ? '#00ff00' : '#333333'
            }}
            required
          />
        </div>

        <button 
          type="submit" 

          style={{
            ...styles.button,
            backgroundColor: status === 'submitting' ? '#111111' : '#000000',
            borderColor: status === 'submitting' ? '#666666' : '#ffffff'
          }}
          disabled={status === 'submitting'}

          onMouseEnter={(e) => {
            if (status !== 'submitting') {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.color = '#000000';
            }
          }}

          onMouseLeave={(e) => {
            if (status !== 'submitting') {
              e.target.style.backgroundColor = '#000000';
              e.target.style.color = '#ffffff';
            }
          }}
        >
          {status === 'submitting' ? 'processing...' : 'subscribe'}
        </button>
      </form>

      {status ==='success' &&(
        <div style={{...styles.message,...styles.success}}>
          {'>'} subscription confirmed. welcome to the list.
        </div>
      )}

      {status ==='duplicate' &&(
        <div style={{...styles.message, ...styles.duplicate}}>
          {'>'} email already subscribed.
        </div>
      )}

      {status ==='error' &&(
        <div style={{...styles.message,...styles.error}}>
          {'>'} error: failed to subscribe. please try again.
        </div>
      )}
    </div>
  );
};

export default MailingListForm;