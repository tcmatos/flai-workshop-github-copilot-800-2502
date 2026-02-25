import React, { useState, useEffect, useCallback } from 'react';

const BASE_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;

function Users() {
  const [users, setUsers]   = useState([]);
  const [teams, setTeams]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // Edit modal state
  const [editUser, setEditUser]     = useState(null);   // user being edited
  const [formData, setFormData]     = useState({});     // controlled form values
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const apiUrl      = `${BASE_URL}/api/users/`;
  const teamsApiUrl = `${BASE_URL}/api/teams/`;

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    console.log('Users: fetching from', apiUrl);
    console.log('Teams: fetching from', teamsApiUrl);
    Promise.all([
      fetch(apiUrl).then(r => { if (!r.ok) throw new Error(`Users: HTTP ${r.status}`); return r.json(); }),
      fetch(teamsApiUrl).then(r => { if (!r.ok) throw new Error(`Teams: HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([usersData, teamsData]) => {
        console.log('Users: fetched data', usersData);
        console.log('Teams: fetched data', teamsData);
        setUsers(Array.isArray(usersData) ? usersData : usersData.results || []);
        setTeams(Array.isArray(teamsData) ? teamsData : teamsData.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl, teamsApiUrl]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  // Parse members whether it's a real array or a Djongo Python-repr string
  const parseMembers = (members) => {
    if (Array.isArray(members)) return members;
    if (typeof members === 'string') {
      try {
        // Handle Python-style list repr: "['a', 'b']" → ["a", "b"]
        const json = members
          .replace(/'/g, '"')
          .replace(/True/g, 'true')
          .replace(/False/g, 'false')
          .replace(/None/g, 'null');
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? parsed : [];
      } catch { return []; }
    }
    return [];
  };

  const getUserTeam = (username) =>
    teams.find(t => parseMembers(t.members).includes(username)) || null;

  // ── Edit modal ─────────────────────────────────────────────────────────────
  const openEdit = (user) => {
    const currentTeam = getUserTeam(user.username);
    setEditUser(user);
    setFormData({
      username: user.username,
      name:     user.name || '',
      email:    user.email,
      password: '',
      teamId:   currentTeam ? currentTeam._id : '',
    });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const closeEdit = () => { setEditUser(null); setSaveError(null); setSaveSuccess(false); };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      // 1. PATCH user details
      const userPayload = { username: formData.username, name: formData.name, email: formData.email };
      if (formData.password) userPayload.password = formData.password;

      const userRes = await fetch(`${apiUrl}${editUser._id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });
      if (!userRes.ok) {
        const errBody = await userRes.text();
        throw new Error(`Save user failed (${userRes.status}): ${errBody}`);
      }
      console.log('Users: PATCH user', editUser._id, userPayload);

      // 2. Update team membership
      const oldTeam = getUserTeam(editUser.username);
      const newTeamId = formData.teamId;
      const oldTeamId = oldTeam ? oldTeam._id : '';

      if (oldTeamId !== newTeamId) {
        // Remove from old team
        if (oldTeam) {
          const updatedMembers = parseMembers(oldTeam.members).filter(m => m !== editUser.username);
          const res = await fetch(`${teamsApiUrl}${oldTeam._id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ members: updatedMembers }),
          });
          if (!res.ok) throw new Error(`Remove from old team failed (${res.status})`);
          console.log('Teams: removed', editUser.username, 'from', oldTeam.name);
        }
        // Add to new team
        if (newTeamId) {
          const newTeam = teams.find(t => t._id === newTeamId);
          if (newTeam) {
            const existing = parseMembers(newTeam.members);
            const updatedMembers = existing.includes(formData.username)
              ? existing
              : [...existing, formData.username];
            const res = await fetch(`${teamsApiUrl}${newTeam._id}/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ members: updatedMembers }),
            });
            if (!res.ok) throw new Error(`Add to new team failed (${res.status})`);
            console.log('Teams: added', formData.username, 'to', newTeam.name);
          }
        }
      } else if (oldTeam && formData.username !== editUser.username) {
        // Same team but username changed – update member entry
        const updatedMembers = parseMembers(oldTeam.members).map(m => m === editUser.username ? formData.username : m);
        await fetch(`${teamsApiUrl}${oldTeam._id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: updatedMembers }),
        });
        console.log('Teams: updated username in team', oldTeam.name);
      }

      setSaveSuccess(true);
      fetchData();          // refresh both users & teams
      setTimeout(closeEdit, 900);
    } catch (err) {
      console.error('Save error', err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-body octofit-spinner-wrap">
          <div className="spinner-border text-success" role="status">
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
        <div className="card-header bg-success text-white d-flex align-items-center gap-2">
          <h4>👤 Users</h4>
          <span className="badge bg-light text-dark ms-auto">{users.length} users</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered octofit-table mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => {
                  const team = getUserTeam(user.username);
                  return (
                    <tr key={user._id || idx}>
                      <td className="text-muted">{idx + 1}</td>
                      <td><span className="fw-semibold">{user.name || <span className="text-muted fst-italic">—</span>}</span></td>
                      <td>{user.username}</td>
                      <td><a href={`mailto:${user.email}`} className="link-secondary">{user.email}</a></td>
                      <td>
                        {team
                          ? <span className="badge bg-primary">{team.name}</span>
                          : <span className="badge bg-secondary">No team</span>}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => openEdit(user)}
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editUser && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">✏️ Edit User — <em>{editUser.username}</em></h5>
                  <button type="button" className="btn-close btn-close-white" onClick={closeEdit} aria-label="Close" />
                </div>
                <div className="modal-body">
                  {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
                  {saveSuccess && <div className="alert alert-success py-2">Saved successfully!</div>}
                  <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <div className="mb-3">
                      <label htmlFor="edit-name" className="form-label fw-semibold">Full Name</label>
                      <input
                        id="edit-name"
                        name="name"
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Tony Stark"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit-username" className="form-label fw-semibold">Username</label>
                      <input
                        id="edit-username"
                        name="username"
                        type="text"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit-email" className="form-label fw-semibold">Email</label>
                      <input
                        id="edit-email"
                        name="email"
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit-password" className="form-label fw-semibold">
                        New Password <span className="text-muted fw-normal">(leave blank to keep current)</span>
                      </label>
                      <input
                        id="edit-password"
                        name="password"
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit-team" className="form-label fw-semibold">Team</label>
                      <select
                        id="edit-team"
                        name="teamId"
                        className="form-select"
                        value={formData.teamId}
                        onChange={handleChange}
                      >
                        <option value="">— No team —</option>
                        {teams.map(t => (
                          <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeEdit} disabled={saving}>Cancel</button>
                  <button className="btn btn-success" onClick={handleSave} disabled={saving}>
                    {saving
                      ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Saving…</>
                      : '💾 Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeEdit} />
        </>
      )}
    </div>
  );
}

export default Users;
