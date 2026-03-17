import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import heroImage from './assets/octofitapp-small.png';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const REACT_APP_CODESPACE_NAME = process.env.REACT_APP_CODESPACE_NAME;
const API_BASE = REACT_APP_CODESPACE_NAME
  ? `https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
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
        console.log(`[App] fetched data from ${resourcePath}:`, payload);
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

function StatusMessage({ loading, error, loadingText }) {
  if (loading) {
    return <p className="status-text fw-semibold">{loadingText}</p>;
  }

  if (error) {
    return <p className="status-text text-danger fw-semibold">{error}</p>;
  }

  return null;
}

function Dashboard() {
  const { data, loading, error } = useApi('/api/summary/', { counts: {}, highlights: {} });
  const [filterKey, setFilterKey] = useState('');

  const status = <StatusMessage loading={loading} error={error} loadingText="Loading dashboard..." />;
  if (status) {
    return status;
  }

  const countRows = [
    { label: 'Users', value: data.counts.users || 0 },
    { label: 'Teams', value: data.counts.teams || 0 },
    { label: 'Activities', value: data.counts.activities || 0 },
    { label: 'Leaderboard', value: data.counts.leaderboard || 0 },
    { label: 'Workouts', value: data.counts.workouts || 0 },
  ];

  const filteredRows = countRows.filter((row) => row.label.toLowerCase().includes(filterKey.toLowerCase()));

  return (
    <section className="row g-3">
      <article className="col-12 col-xl-7">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h2 className="h4 card-title mb-3">Collections Summary</h2>

            <form className="row g-2 align-items-end mb-3" onSubmit={(e) => e.preventDefault()}>
              <div className="col-12 col-md-8">
                <label htmlFor="summaryFilter" className="form-label">Filter Table</label>
                <input
                  id="summaryFilter"
                  className="form-control"
                  type="text"
                  placeholder="e.g. users"
                  value={filterKey}
                  onChange={(e) => setFilterKey(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setFilterKey('')}>
                  Reset Filter
                </button>
              </div>
            </form>

            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle consistent-table">
                <thead className="table-light">
                  <tr>
                    <th>Collection</th>
                    <th className="text-end">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      <td className="text-end fw-semibold">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <a href={`${API_BASE}/api/summary/`} className="link-primary link-underline-opacity-25 link-underline-opacity-100-hover" target="_blank" rel="noreferrer">
              Open Summary API
            </a>
          </div>
        </div>
      </article>

      <article className="col-12 col-xl-5">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h2 className="h4 card-title mb-3">Highlights</h2>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle consistent-table">
                <thead className="table-light">
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Top User</td>
                    <td>{data.highlights.top_user?.username || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Top User Points</td>
                    <td>{data.highlights.top_user?.points || 0}</td>
                  </tr>
                  <tr>
                    <td>Top Team</td>
                    <td>{data.highlights.top_team_entry?.team_name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Top Team Score</td>
                    <td>{data.highlights.top_team_entry?.score || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <span className="badge rounded-pill text-bg-success">Live API</span>
              <span className="badge rounded-pill text-bg-info">MongoDB</span>
              <span className="badge rounded-pill text-bg-dark">Django + React</span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

const navItems = [
  { path: '/', label: 'Dashboard', element: <Dashboard />, end: true },
  { path: '/users', label: 'Users', element: <Users /> },
  { path: '/teams', label: 'Teams', element: <Teams /> },
  { path: '/leaderboard', label: 'Leaderboard', element: <Leaderboard /> },
  { path: '/activities', label: 'Activities', element: <Activities /> },
  { path: '/workouts', label: 'Workouts', element: <Workouts /> },
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="hero-block container-fluid">
          <div className="hero-copy">
            <h1 className="display-5 fw-bold mb-2">OctoFit Tracker</h1>
            <p className="lead mb-3">Team performance, activity logs, and workout insights in one place.</p>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-dark" onClick={() => setIsModalOpen(true)}>
                Open Quick Guide
              </button>
              <a
                className="btn btn-outline-primary"
                href={`${API_BASE}/api/`}
                target="_blank"
                rel="noreferrer"
              >
                API Root
              </a>
            </div>
          </div>
          <img src={heroImage} alt="OctoFit visual" className="hero-image" />
        </header>

        <nav className="top-nav" aria-label="Main Navigation">
          <ul className="nav nav-pills gap-2 flex-wrap">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink
                  end={item.end}
                  to={item.path}
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="content-wrap container-fluid">
          <Routes>
            {navItems.map((item) => (
              <Route key={item.path} path={item.path} element={item.element} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {isModalOpen ? (
          <>
            <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2 className="modal-title h5 mb-0">OctoFit Quick Guide</h2>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setIsModalOpen(false)} />
                  </div>
                  <div className="modal-body">
                    <p className="mb-2">Use the top navigation to move between each dataset page.</p>
                    <p className="mb-0">Every page uses the same Bootstrap table layout and loads data from Django REST API.</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show" />
          </>
        ) : null}
      </div>
    </BrowserRouter>
  );
}

export default App;
