import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  useEffect(() => {
    console.log('Teams: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Teams: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-body octofit-spinner-wrap">
          <div className="spinner-border text-primary" role="status">
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
        <div className="card-header bg-primary text-white d-flex align-items-center gap-2">
          <h4>🏆 Teams</h4>
          <span className="badge bg-light text-dark ms-auto">{teams.length} teams</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered octofit-table mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Team Name</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, idx) => (
                  <tr key={team._id || idx}>
                    <td className="text-muted">{idx + 1}</td>
                    <td><span className="fw-semibold">{team.name}</span></td>
                    <td>
                      {Array.isArray(team.members)
                        ? team.members.map((m, i) => (
                            <span key={i} className="badge bg-primary me-1">{m}</span>
                          ))
                        : team.members}
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

export default Teams;
