import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import logo from './octofitapp-small.png';
import './App.css';

const NAV_ITEMS = [
  { path: '/users',       label: 'Users',       icon: '👤' },
  { path: '/teams',       label: 'Teams',       icon: '🏆' },
  { path: '/activities',  label: 'Activities',  icon: '🏃' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '📊' },
  { path: '/workouts',    label: 'Workouts',    icon: '💪' },
];

function Home() {
  return (
    <div className="container mt-5">
      <div className="octofit-hero text-center mb-5">
        <img src={logo} alt="OctoFit" style={{ width: 80, height: 80, borderRadius: 16, marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.45)' }} />
        <h1>OctoFit Tracker</h1>
        <p className="lead">Track activities, manage teams, and compete on the leaderboard.</p>
        <Link to="/activities" className="btn btn-info btn-lg mt-3 me-2">Get Started</Link>
        <Link to="/leaderboard" className="btn btn-outline-light btn-lg mt-3">View Leaderboard</Link>
      </div>

      <div className="row g-4">
        {NAV_ITEMS.map(({ path, label, icon }) => (
          <div key={path} className="col-12 col-sm-6 col-lg-4">
            <div className="card octofit-feature-card h-100">
              <div className="card-body text-center py-4">
                <div style={{ fontSize: '2.5rem' }}>{icon}</div>
                <h5 className="card-title mt-2 fw-semibold">{label}</h5>
                <Link to={path} className="btn btn-dark btn-sm mt-2">View {label}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark octofit-navbar">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="OctoFit logo" />
            <span>OctoFit Tracker</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {NAV_ITEMS.map(({ path, label, icon }) => (
                <li key={path} className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                    to={path}
                  >
                    {icon} {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
