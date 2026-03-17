import { useEffect, useState } from 'react';

const REACT_APP_CODESPACE_NAME = process.env.REACT_APP_CODESPACE_NAME;
const API_BASE = REACT_APP_CODESPACE_NAME
  ? `https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const endpoint = `${API_BASE}/api/activities/`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload) ? payload : (payload?.results || []);
        console.log('[Activities] endpoint:', endpoint);
        console.log('[Activities] fetched data:', normalized);
        if (active) {
          setActivities(normalized);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load activities');
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
    return <p className="status-text">Loading activities...</p>;
  }

  if (error) {
    return <p className="status-text error-text">{error}</p>;
  }

  if (!activities.length) {
    return <p className="status-text">No activity data yet.</p>;
  }

  const filtered = activities.filter((activity) => (
    activity.activity_type.toLowerCase().includes(query.toLowerCase())
    || activity.user_email.toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 card-title">Recent Activities</h2>
        <form className="row g-2 align-items-end mb-3" onSubmit={(e) => e.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="activitiesSearch" className="form-label">Search Activities</label>
            <input
              id="activitiesSearch"
              className="form-control"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type activity or email"
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
                <th>Activity</th>
                <th>User</th>
                <th className="text-end">Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.activity_type}</td>
                  <td>{activity.user_email}</td>
                  <td className="text-end">{activity.distance_km}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a className="link-primary" href={`${API_BASE}/api/activities/`} target="_blank" rel="noreferrer">
          Open Activities API
        </a>
      </div>
    </section>
  );
}
