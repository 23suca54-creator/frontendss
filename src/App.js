import React from 'react';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import './styles/global.css';

function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="logo" aria-hidden>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width:22,height:22,color:'#fff',marginLeft:6}}>
              <path d="M2 5a2 2 0 012-2h3a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
              <path d="M12 3h4a1 1 0 011 1v12a1 1 0 01-1 1h-4V3z" />
            </svg>
          </div>
          <div>
            <h1>Job Tracker</h1>
            <div className="subtle">Track applications — create, edit and manage interviews</div>
          </div>
        </div>

        <div className="search">
          <input aria-label="Search jobs" placeholder="Search company, title, location or notes" onChange={(e) => window.dispatchEvent(new CustomEvent('jobSearch', { detail: e.target.value }))} />
        </div>
      </header>

      <div className="main-grid">
        <JobForm />
        <JobList />
      </div>
    </div>
  );
}

export default App;
