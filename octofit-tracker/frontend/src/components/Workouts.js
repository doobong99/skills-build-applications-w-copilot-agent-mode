import { useEffect, useState } from 'react';

const REACT_APP_CODESPACE_NAME = process.env.REACT_APP_CODESPACE_NAME;
const API_BASE = REACT_APP_CODESPACE_NAME
  ? `https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const endpoint = `${API_BASE}/api/workouts/`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload) ? payload : (payload?.results || []);
        console.log('[Workouts] endpoint:', endpoint);
        console.log('[Workouts] fetched data:', normalized);
        if (active) {
          setWorkouts(normalized);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load workouts');
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
    return <p className="status-text">Loading workouts...</p>;
  }

  if (error) {
    return <p className="status-text error-text">{error}</p>;
  }

  if (!workouts.length) {
    return <p className="status-text">No workout data found.</p>;
  }

  const filtered = workouts.filter((workout) => (
    workout.workout_name.toLowerCase().includes(query.toLowerCase())
    || workout.user_email.toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 card-title">Workouts</h2>
        <form className="row g-2 align-items-end mb-3" onSubmit={(e) => e.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="workoutsSearch" className="form-label">Search Workouts</label>
            <input
              id="workoutsSearch"
              className="form-control"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type workout or email"
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
                <th>Workout</th>
                <th>User</th>
                <th className="text-end">Duration (min)</th>
                <th className="text-end">Calories</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((workout) => (
                <tr key={workout.id}>
                  <td>{workout.workout_name}</td>
                  <td>{workout.user_email}</td>
                  <td className="text-end">{workout.duration_minutes}</td>
                  <td className="text-end">{workout.calories_burned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a className="link-primary" href={`${API_BASE}/api/workouts/`} target="_blank" rel="noreferrer">
          Open Workouts API
        </a>
      </div>
    </section>
  );
}
