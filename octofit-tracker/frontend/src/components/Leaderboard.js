import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    console.log('Leaderboard: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Leaderboard: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setEntries(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  const medal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-body octofit-spinner-wrap">
          <div className="spinner-border text-warning" role="status">
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
        <div className="card-header bg-warning text-dark d-flex align-items-center gap-2">
          <h4>📊 Leaderboard</h4>
          <span className="badge bg-dark ms-auto">{entries.length} players</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered octofit-table mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Score</th>
                  <th>Total Calories</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={entry._id || idx} className={idx === 0 ? 'table-warning fw-bold' : ''}>
                    <td style={{ fontSize: '1.2rem' }}>{medal(idx + 1)}</td>
                    <td><span className="fw-semibold">{entry.username}</span></td>
                    <td><span className="badge bg-success fs-6">{entry.score}</span></td>
                    <td><span className="badge bg-warning text-dark fs-6">🔥 {entry.calories ?? '—'} kcal</span></td>
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

export default Leaderboard;
