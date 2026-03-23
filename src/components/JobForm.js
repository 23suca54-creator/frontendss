import React, { useState, useEffect } from 'react';
import axios from '../api';

// Form to create or update a job application
const initialForm = {
  companyName: '',
  jobTitle: '',
  location: '',
  salary: '',
  applicationDate: '',
  status: 'APPLIED',
  notes: ''
};

export default function JobForm() {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Listen for edit events from the list
  useEffect(() => {
    const handler = (e) => {
      const job = e.detail || e;
      // normalize fields we care about
      setForm({
        companyName: job.companyName || '',
        jobTitle: job.jobTitle || '',
        location: job.location || '',
        salary: job.salary != null ? String(job.salary) : '',
        applicationDate: job.applicationDate || '',
        status: job.status || 'APPLIED',
        notes: job.notes || ''
      });
      setEditingId(job.id);
      setMessage('Editing job #' + job.id);
    };
    window.addEventListener('jobEdit', handler);
    return () => window.removeEventListener('jobEdit', handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        salary: form.salary === '' ? null : parseFloat(form.salary)
      };
      if (editingId) {
        await axios.put(`/jobs/${editingId}`, payload);
        setMessage('Job updated successfully');
      } else {
        await axios.post('/jobs', payload);
        setMessage('Job created successfully');
      }
      setForm(initialForm);
      setEditingId(null);
      // Dispatch a custom event so JobList can refresh
      window.dispatchEvent(new Event('jobListShouldRefresh'));
    } catch (err) {
  console.error('Job create/update error', err);
  // Prefer server-provided message when available, otherwise use generic error
  const serverMsg = err && err.response && err.response.data ? (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data)) : null;
  setMessage('Error creating job' + (serverMsg ? (': ' + serverMsg) : (': ' + (err.message || 'unknown error'))));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setMessage('');
  };

  return (
    <div className="card form-card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h2>{editingId ? 'Edit Job' : 'Add Job'}</h2>
        {message && <div className="message">{message}</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Company Name</label>
          <input name="companyName" value={form.companyName} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium">Job Title</label>
          <input name="jobTitle" value={form.jobTitle} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
        </div>

        <div style={{display:'flex',gap:10}}>
          <div style={{flex:1}}>
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} required />
          </div>
          <div style={{flex:1}}>
            <label>Salary</label>
            <input name="salary" type="number" step="0.01" value={form.salary} onChange={handleChange} />
          </div>
        </div>

        <div style={{display:'flex',gap:10}}>
          <div style={{flex:1}}>
            <label>Application Date</label>
            <input name="applicationDate" type="date" value={form.applicationDate} onChange={handleChange} required />
          </div>
          <div style={{flex:1}}>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="APPLIED">APPLIED</option>
              <option value="INTERVIEW_SCHEDULED">INTERVIEW_SCHEDULED</option>
              <option value="OFFERED">OFFERED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        <div>
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn primary">{loading ? 'Saving...' : (editingId ? 'Update Job' : 'Save Job')}</button>
          {editingId && <button type="button" onClick={handleCancel} className="btn ghost">Cancel</button>}
        </div>
      </form>
    </div>
  );
}
