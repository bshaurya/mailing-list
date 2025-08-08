import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });

  const authenticate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (adminKey === 'shaurya-admin-2024-secure-key') {
      setIsAuthenticated(true);
      await loadDashboardData();
    }
    else {
      setIsAuthenticated(true);
      setSubscribers([
        { id: 1, email: 'stop@trying.com', subscribed_at: new Date().toISOString(), is_active: true },
        { id: 2, email: 'to@take.com', subscribed_at: new Date().toISOString(), is_active: true },
        { id: 3, email: 'not@yourdata.com', subscribed_at: new Date().toISOString(), is_active: false },
        { id: 4, email: 'unauthorized@user.com', subscribed_at: new Date().toISOString(), is_active: true }
      ]);
      setStats({ total: 4, today: 2, thisWeek: 4 });
    }
    
    setLoading(false);
  };

  const loadDashboardData = async () => {
    try {
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (subscribersError) {
        console.error('Supabase error:', subscribersError);
        return;
      }

      const data = subscribersData || [];
      setSubscribers(data);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const todayCount = data.filter(s => 
        new Date(s.subscribed_at) >= today
      ).length;
      const weekCount = data.filter(s => 
        new Date(s.subscribed_at) >= weekAgo
      ).length;

      setStats({
        total: data.length,
        today: todayCount,
        thisWeek: weekCount
      });

    }
    
    catch (error) {
      console.error('Error loading dashboard:', error);
      setSubscribers([]);
      setStats({ total: 0, today: 0, thisWeek: 0 });
    }
  };

  const exportCSV = () => {
    if (adminKey !== 'shaurya-admin-2024-secure-key') {
      alert('nice try, but no.');
      return;
    }
    
    const csvContent = [
      ['Email', 'Subscribed At', 'Status'],
      ...subscribers.map(s => [
        s.email,
        new Date(s.subscribed_at).toLocaleString(),
        s.is_active ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Monaco, "Lucida Console", monospace',
      backgroundColor: '#000000',
      color: '#ffffff',
      minHeight: '100vh'
    },
    authForm: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '3rem 2rem',
      border: '1px solid #333333',
      textAlign: 'center'
    },
    header: {
      borderBottom: '1px solid #333333',
      paddingBottom: '1rem',
      marginBottom: '2rem'
    },
    prompt: {
      fontSize: '0.9rem',
      color: '#00ff00',
      marginBottom: '0.5rem'
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '400',
      marginBottom: '1rem',
      color: '#ffffff'
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      fontSize: '1rem',
      border: '1px solid #333333',
      backgroundColor: '#111111',
      color: '#ffffff',
      outline: 'none',
      fontFamily: 'Monaco, "Lucida Console", monospace',
      boxSizing: 'border-box',
      marginBottom: '1rem'
    },
    button: {
      padding: '0.8rem 1.5rem',
      fontSize: '1rem',
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '1px solid #ffffff',
      cursor: 'pointer',
      fontFamily: 'Monaco, "Lucida Console", monospace',
      textTransform: 'lowercase'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      border: '1px solid #333333',
      padding: '1rem',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '2rem',
      color: '#00ff00',
      fontWeight: 'bold'
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#cccccc'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.9rem'
    },
    th: {
      border: '1px solid #333333',
      padding: '0.8rem',
      textAlign: 'left',
      backgroundColor: '#111111',
      color: '#00ff00'
    },
    td: {
      border: '1px solid #333333',
      padding: '0.8rem'
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.authForm}>
          <div style={styles.header}>
            <div style={styles.prompt}>admin@dashboard:~$</div>
            <h1 style={styles.title}>./authenticate</h1>
          </div>
          <form onSubmit={authenticate}>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="enter admin key"
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'verifying...' : 'access dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.prompt}>shaurya@dashboard:~$</div>
        <h1 style={styles.title}>./mailing-list-dashboard</h1>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>total subscribers</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.today}</div>
          <div style={styles.statLabel}>today</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.thisWeek}</div>
          <div style={styles.statLabel}>this week</div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={exportCSV} style={styles.button}>
          export csv
        </button>
        <button 
          onClick={() => window.location.reload()} 
          style={{...styles.button, marginLeft: '1rem'}}
        >
          refresh
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>email</th>
            <th style={styles.th}>subscribed</th>
            <th style={styles.th}>status</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((subscriber) => (
            <tr key={subscriber.id}>
              <td style={styles.td}>{subscriber.email}</td>
              <td style={styles.td}>
                {new Date(subscriber.subscribed_at).toLocaleString()}
              </td>
              <td style={styles.td}>
                {subscriber.is_active ? 'active' : 'inactive'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;