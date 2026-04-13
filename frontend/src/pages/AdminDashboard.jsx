import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Search, Download, Users, Award, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/results');
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredResults = results.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = filterBranch === 'All' || res.branch === filterBranch;
    return matchesSearch && matchesBranch;
  });

  const branches = ['All', ...new Set(results.map(res => res.branch))];

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Pin', 'Branch', 'Stage 1', 'Stage 2', 'Coding', 'Total', 'Warnings', 'Status', 'Timestamp'];
    const rows = filteredResults.map(res => [
      res.name,
      res.email,
      res.pin,
      res.branch,
      res.stage1Score,
      res.stage2Score,
      res.codingScore,
      res.totalScore,
      res.proctorWarnings,
      res.passed ? 'PASSED' : 'FAILED',
      res.timestamp
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      headers.join(",") + "\n" + 
      rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `exam_results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const avgScore = results.length > 0 ? (results.reduce((acc, curr) => acc + curr.totalScore, 0) / results.length).toFixed(1) : 0;
  const passRate = results.length > 0 ? ((results.filter(r => r.passed).length / results.length) * 100).toFixed(1) : 0;
  const totalWarnings = results.reduce((acc, curr) => acc + curr.proctorWarnings, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <span className="p-2 rounded-xl bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] text-black">
                <Award size={32} />
              </span>
              Exam Results Console
            </h1>
            <p className="text-slate-500 mt-2 font-medium tracking-wide">TechWing Assessment Data Management</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchResults}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-slate-400"
              title="Refresh Data"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-orange-500 transition-all uppercase text-sm tracking-widest shadow-lg"
            >
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Candidates', value: results.length, icon: <Users className="text-blue-400" />, color: 'blue' },
            { label: 'Average Score', value: `${avgScore}`, icon: <Award className="text-orange-400" />, color: 'orange' },
            { label: 'Pass Rate', value: `${passRate}%`, icon: <div className="w-2 h-2 rounded-full bg-green-500" />, color: 'green' },
            { label: 'Total Violations', value: totalWarnings, icon: <AlertTriangle className="text-red-400" />, color: 'red' },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="bg-[#0c0c0c] border border-slate-900 p-6 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-4 mb-3">
                <span className="p-2 rounded-lg bg-white/5">{stat.icon}</span>
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-3xl font-black text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#0c0c0c] border border-slate-900 p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <select 
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="bg-[#111] border border-slate-800 rounded-xl py-3 px-6 text-white focus:outline-none focus:border-orange-500 transition-colors min-w-[150px]"
          >
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-[#0c0c0c] border border-slate-900 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-900 bg-[#111]">
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Student Info</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center">Branch/Pin</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center">S1 (Apt)</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center">S2 (Tech)</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center">S3 (Code)</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center">Total</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center">Proctor</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="p-20 text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 mx-auto mb-4"></div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Secure Data...</p>
                    </td>
                  </tr>
                ) : filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-20 text-center text-slate-500 font-bold uppercase tracking-widest text-sm">
                      No results found matching your criteria
                    </td>
                  </tr>
                ) : filteredResults.map((res, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    key={res.id || i} 
                    className="border-b border-slate-900 hover:bg-[#111]/50 transition-colors"
                  >
                    <td className="p-5">
                      <div className="font-bold text-white mb-0.5">{res.name}</div>
                      <div className="text-xs text-slate-500 font-medium">{res.email}</div>
                    </td>
                    <td className="p-5 text-center">
                      <div className="text-xs font-black px-2 py-1 bg-white/5 rounded-md inline-block uppercase text-orange-400">{res.branch}</div>
                      <div className="text-[10px] text-slate-600 mt-1 font-bold">{res.pin}</div>
                    </td>
                    <td className="p-5 text-center font-bold">{res.stage1Score}</td>
                    <td className="p-5 text-center font-bold">{res.stage2Score}</td>
                    <td className="p-5 text-center font-bold text-orange-500">{res.codingScore}</td>
                    <td className="p-5 text-center">
                      <div className="text-xl font-black text-white">{res.totalScore}</div>
                    </td>
                    <td className="p-5 text-center">
                      <div className={`text-xs p-1 rounded-md font-bold uppercase ${res.proctorWarnings > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {res.proctorWarnings} Warns
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <div className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-block ${res.passed ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {res.passed ? 'Certified' : 'Failed'}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
