import { useEffect, useState } from 'react';

const REACT_APP_CODESPACE_NAME = process.env.REACT_APP_CODESPACE_NAME;
const API_BASE = REACT_APP_CODESPACE_NAME
  ? `https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const endpoint = `${API_BASE}/api/teams/`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload) ? payload : (payload?.results || []);
        console.log('[Teams] endpoint:', endpoint);
        console.log('[Teams] fetched data:', normalized);
        if (active) {
          setTeams(normalized);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load teams');
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
    return <p className="status-text">Loading teams...</p>;
  }

  if (error) {
    return <p className="status-text error-text">{error}</p>;
  }

  if (!teams.length) {
    return <p className="status-text">No team data found.</p>;
  }

  const filtered = teams.filter((team) => (
    team.name.toLowerCase().includes(query.toLowerCase())
    || team.universe.toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 card-title">Teams</h2>
        <form className="row g-2 align-items-end mb-3" onSubmit={(e) => e.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="teamsSearch" className="form-label">Search Teams</label>
            <input
              id="teamsSearch"
              className="form-control"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type team or universe"
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
                <th>Name</th>
                <th>Universe</th>
                <th>Motto</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((team) => (
                <tr key={team.id}>
                  <td>{team.name}</td>
                  <td>{team.universe}</td>
                  <td>{team.motto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a className="link-primary" href={`${API_BASE}/api/teams/`} target="_blank" rel="noreferrer">
          Open Teams API
        </a>
      </div>
    </section>
  );
}
