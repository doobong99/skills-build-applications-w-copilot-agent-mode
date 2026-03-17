import { useEffect, useState } from 'react';

const REACT_APP_CODESPACE_NAME = process.env.REACT_APP_CODESPACE_NAME;
const API_BASE = REACT_APP_CODESPACE_NAME
  ? `https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const endpoint = `${API_BASE}/api/users/`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload) ? payload : (payload?.results || []);
        console.log('[Users] endpoint:', endpoint);
        console.log('[Users] fetched data:', normalized);
        if (active) {
          setUsers(normalized);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load users');
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
    return <p className="status-text">Loading users...</p>;
  }

  if (error) {
    return <p className="status-text error-text">{error}</p>;
  }

  if (!users.length) {
    return <p className="status-text">No users found.</p>;
  }

  const filtered = users.filter((user) => (
    user.username.toLowerCase().includes(query.toLowerCase())
    || user.email.toLowerCase().includes(query.toLowerCase())
    || user.team_name.toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 card-title">Users</h2>
        <form className="row g-2 align-items-end mb-3" onSubmit={(e) => e.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="usersSearch" className="form-label">Search Users</label>
            <input
              id="usersSearch"
              className="form-control"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type name, email, or team"
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
                <th>Email</th>
                <th>Team</th>
                <th className="text-end">Points</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.team_name}</td>
                  <td className="text-end">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a className="link-primary" href={`${API_BASE}/api/users/`} target="_blank" rel="noreferrer">
          Open Users API
        </a>
      </div>
    </section>
  );
}
