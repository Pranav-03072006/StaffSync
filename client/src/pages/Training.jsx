import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Plus,
  Calendar,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Trash2,
  Building2,
  Award
} from 'lucide-react';

export default function Training() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trainer: '',
    department: 'All',
    startDate: '',
    endDate: '',
    status: 'upcoming'
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canManage = user?.role === 'admin' || user?.role === 'manager';

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/training');
      setTrainings(res.data);
    } catch (err) {
      console.error('Failed to fetch trainings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await API.post('/training', formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        trainer: '',
        department: 'All',
        startDate: '',
        endDate: '',
        status: 'upcoming'
      });
      fetchTrainings();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create training program');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/training/${id}`, { status: newStatus });
      fetchTrainings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this training program?')) return;
    try {
      await API.delete(`/training/${id}`);
      fetchTrainings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete program');
    }
  };

  const filteredTrainings = trainings.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-brand-600" />
            Training & Development Programs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Empowering workforce growth with skill development, certifications, and workshops.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Program</span>
          </button>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Programs</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{trainings.length}</h3>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Upcoming</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">
              {trainings.filter(t => t.status === 'upcoming').length}
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">In Progress</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">
              {trainings.filter(t => t.status === 'in-progress').length}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Completed</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {trainings.filter(t => t.status === 'completed').length}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {['all', 'upcoming', 'in-progress', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              filter === tab
                ? 'bg-brand-50 text-brand-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Program List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Loading training programs...</div>
      ) : filteredTrainings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-slate-700">No training programs found</h4>
          <p className="text-sm text-slate-500 mt-1">
            {canManage ? 'Click "Create Program" to publish a new training module.' : 'No programs available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainings.map((program) => (
            <div
              key={program._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      program.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : program.status === 'in-progress'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {program.status.replace('-', ' ')}
                  </span>

                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {program.department}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-2">{program.title}</h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                  {program.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                  <p className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Trainer: <strong className="text-slate-700">{program.trainer || 'L&D Team'}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {canManage ? (
                  <div className="flex items-center gap-2 w-full justify-between">
                    <select
                      value={program.status}
                      onChange={(e) => handleStatusUpdate(program._id, e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      onClick={() => handleDelete(program._id)}
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition"
                      title="Delete Program"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStatusUpdate(program._id, program.status === 'completed' ? 'in-progress' : 'completed')}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{program.status === 'completed' ? 'Re-open' : 'Mark Completed'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Program Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create Training Program</h2>
            <p className="text-xs text-slate-500 mb-4">
              Schedule a development program and assign it to employees or departments.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Full-Stack Web Development"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Detailed objectives, curriculum, and goals..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trainer / Instructor</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Architect"
                    value={formData.trainer}
                    onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
