import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    console.log('Workouts: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Workouts: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setWorkouts(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-body octofit-spinner-wrap">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-header bg-danger text-white d-flex align-items-center gap-2">
          <h4>💪 Workouts</h4>
          <span className="badge bg-light text-dark ms-auto">{workouts.length} workouts</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered octofit-table mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Exercises</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, idx) => (
                  <tr key={workout._id || idx}>
                    <td className="text-muted">{idx + 1}</td>
                    <td><span className="fw-semibold">{workout.name}</span></td>
                    <td>{workout.description}</td>
                    <td>
                      {Array.isArray(workout.exercises)
                        ? workout.exercises.map((ex, i) => (
                            <span key={i} className="badge bg-danger me-1 badge-exercise">{ex}</span>
                          ))
                        : workout.exercises}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workouts;
