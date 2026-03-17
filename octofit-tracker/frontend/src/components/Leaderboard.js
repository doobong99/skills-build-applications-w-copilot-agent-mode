import { useEffect, useState } from 'react';

const REACT_APP_CODESPACE_NAME = process.env.REACT_APP_CODESPACE_NAME;
const API_BASE = REACT_APP_CODESPACE_NAME
  ? `https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const endpoint = `${API_BASE}/api/leaderboard/`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload) ? payload : (payload?.results || []);
        console.log('[Leaderboard] endpoint:', endpoint);
        console.log('[Leaderboard] fetched data:', normalized);
        if (active) {
          setRows(normalized);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load leaderboard');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="status-text">Loading leaderboard...</p>;
  }

  if (error) {
    return <p className="status-text error-text">{error}</p>;
  }

  if (!rows.length) {
    return <p className="status-text">No leaderboard data yet.</p>;
  }

  const filtered = rows.filter((row) => (
    row.user_email.toLowerCase().includes(query.toLowerCase())
    || row.team_name.toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 card-title">Leaderboard</h2>
        <form className="row g-2 align-items-end mb-3" onSubmit={(e) => e.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="leaderboardSearch" className="form-label">Search Leaderboard</label>
            <input
              id="leaderboardSearch"
              className="form-control"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type user or team"
            />
          </div>
          <div className="col-12 col-md-4">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setQuery('')}>
              Reset
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle consistent-table">
            <thead className="table-light">
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Team</th>
                <th className="text-end">Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>{row.rank}</td>
                  <td>{row.user_email}</td>
                  <td>{row.team_name}</td>
                  <td className="text-end">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a className="link-primary" href={`${API_BASE}/api/leaderboard/`} target="_blank" rel="noreferrer">
          Open Leaderboard API
        </a>
      </div>
    </section>
  );
}
