import React, { useEffect, useState } from 'react';
import axios from '../api';

// Displays job applications in a table and allows deletion
export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
  const res = await axios.get('/jobs');
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const handler = () => fetchJobs();
    window.addEventListener('jobListShouldRefresh', handler);
    const searchHandler = (e) => setSearchTerm((e && e.detail) || '');
    window.addEventListener('jobSearch', searchHandler);
    return () => window.removeEventListener('jobListShouldRefresh', handler);
  }, []);

  useEffect(() => {
    // apply search + sort client-side
    let list = Array.isArray(jobs) ? [...jobs] : [];
    if (searchTerm && searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      list = list.filter(j => (
        (j.companyName || '').toLowerCase().includes(q) ||
        (j.jobTitle || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q) ||
        (j.notes || '').toLowerCase().includes(q)
      ));
    }
    if (sortKey) {
      list.sort((a, b) => {
        const va = (a[sortKey] == null) ? '' : String(a[sortKey]).toLowerCase();
        const vb = (b[sortKey] == null) ? '' : String(b[sortKey]).toLowerCase();
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    setFiltered(list);
  }, [jobs, searchTerm, sortKey, sortDir]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
  await axios.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert('Error deleting job');
    }
  };

  return (
    <div className="card list-card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h2>Job List</h2>
        <div style={{color:'#6b7280',fontSize:13}}>{jobs.length} total</div>
      </div>

      {loading && <div style={{textAlign:'center',padding:24}}>Loading...</div>}
      {error && <div style={{color:'#b00020'}}>{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th style={{cursor:'pointer'}} onClick={() => { setSortKey('companyName'); setSortDir(sortKey==='companyName' && sortDir==='asc' ? 'desc' : 'asc'); }}>Company</th>
              <th style={{cursor:'pointer'}} onClick={() => { setSortKey('jobTitle'); setSortDir(sortKey==='jobTitle' && sortDir==='asc' ? 'desc' : 'asc'); }}>Title</th>
              <th>Location</th>
              <th style={{cursor:'pointer'}} onClick={() => { setSortKey('salary'); setSortDir(sortKey==='salary' && sortDir==='asc' ? 'desc' : 'asc'); }}>Salary</th>
              <th style={{cursor:'pointer'}} onClick={() => { setSortKey('applicationDate'); setSortDir(sortKey==='applicationDate' && sortDir==='asc' ? 'desc' : 'asc'); }}>Date</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(job => (
              <tr key={job.id} style={{transition:'background .12s'}}>
                <td>{job.id}</td>
                <td>{job.companyName}</td>
                <td>{job.jobTitle}</td>
                <td>{job.location}</td>
                <td>{job.salary != null ? job.salary : ''}</td>
                <td>{job.applicationDate}</td>
                <td>{job.status}</td>
                <td>{job.notes}</td>
                <td className="actions">
                  <button onClick={() => window.dispatchEvent(new CustomEvent('jobEdit', { detail: job }))} style={{padding:'6px 10px',borderRadius:6,background:'#fde68a',color:'#92400e',border:'none'}}>Edit</button>
                  <button style={{padding:'6px 10px',borderRadius:6,background:'#ef4444',color:'#fff',border:'none'}} onClick={() => handleDelete(job.id)}>Delete</button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan="9" className="empty">No jobs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

