import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import heroImage from './assets/octofitapp-small.png';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const API_BASE = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

function useApi(resourcePath, initialValue) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE}${resourcePath}`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        if (isActive) {
          setData(payload);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || 'Failed to load data');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isActive = false;
    };
  }, [resourcePath]);

  return { data, loading, error };
}

function Dashboard() {
  const { data, loading, error } = useApi('/api/summary/', { counts: {}, highlights: {} });

  if (loading) {
    return <p className="status-text">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="status-text error-text">{error}</p>;
  }

  return (
    <section className="panel-grid">
      <article className="panel-card">
        <h2>Collections</h2>
        <ul className="metric-list">
          <li>Users: {data.counts.users || 0}</li>
          <li>Teams: {data.counts.teams || 0}</li>
          <li>Activities: {data.counts.activities || 0}</li>
          <li>Leaderboard: {data.counts.leaderboard || 0}</li>
          <li>Workouts: {data.counts.workouts || 0}</li>
        </ul>
      </article>
      <article className="panel-card">
        <h2>Highlights</h2>
        <p>Top User: {data.highlights.top_user?.username || 'N/A'}</p>
        <p>Points: {data.highlights.top_user?.points || 0}</p>
        <p>Top Team: {data.highlights.top_team_entry?.team_name || 'N/A'}</p>
        <p>Team Score: {data.highlights.top_team_entry?.score || 0}</p>
      </article>
    </section>
  );
}

function Leaderboard() {
  const { data, loading, error } = useApi('/api/leaderboard/', []);

  if (loading) {
    return <p className="status-text">Loading leaderboard...</p>;
  }

  if (error) {
    return <p className="status-text error-text">{error}</p>;
  }

  return (
    <section className="panel-card">
      <h2>Leaderboard</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Team</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.rank}</td>
                <td>{row.user_email}</td>
                <td>{row.team_name}</td>
                <td>{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Activities() {
  const { data, loading, error } = useApi('/api/activities/', []);

  if (loading) {
    return <p className="status-text">Loading activities...</p>;
  }

  if (error) {
    return <p className="status-text error-text">{error}</p>;
  }

  return (
    <section className="panel-card">
      <h2>Recent Activities</h2>
      <ul className="activity-list">
        {data.map((activity) => (
          <li key={activity.id}>
            <strong>{activity.activity_type}</strong> - {activity.user_email} ({activity.distance_km} km)
          </li>
        ))}
      </ul>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="hero-block">
          <div>
            <h1>OctoFit Tracker</h1>
            <p>Team performance, activity logs, and workout insights in one place.</p>
          </div>
          <img src={heroImage} alt="OctoFit visual" className="hero-image" />
        </header>

        <nav className="top-nav">
          <NavLink end to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Dashboard
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Leaderboard
          </NavLink>
          <NavLink to="/activities" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Activities
          </NavLink>
        </nav>

        <main className="content-wrap">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/activities" element={<Activities />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
