import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({ name: '', pin: '', branch: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const branches = ['CSE', 'CDS', 'CSM', 'CSC', 'ECE', 'EEE', 'MECH'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.name.trim().length < 3) return setError('Name must be min 3 chars');
    if (!formData.pin.trim()) return setError('Please enter your PIN number');
    if (!formData.branch) return setError('Please select a branch');
    if (formData.password.length < 6) return setError('Password must be min 6 chars');

    setLoading(true);

    if (auth.app.options.apiKey === "dummy_api_key") {
      const { useAuthStore } = await import('../store/authStore');
      useAuthStore.getState().setMockSession({
        name: formData.name,
        pin: formData.pin,
        branch: formData.branch,
        email: formData.email,
        role: "student"
      });
      setLoading(false);
      navigate('/dashboard');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: formData.name,
        pin: formData.pin,
        branch: formData.branch,
        email: formData.email,
        role: "student",
        lastLogin: new Date().toISOString()
      }, { merge: true });
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          await setDoc(doc(db, "users", cred.user.uid), {
            name: formData.name,
            pin: formData.pin,
            branch: formData.branch,
            email: formData.email,
            role: "student",
            createdAt: new Date().toISOString()
          });
          navigate('/dashboard');
        } catch (createErr) {
          setError(createErr.message || 'Error creating account.');
        }
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const offerings = [
    {
      title: "Corporate Trainings",
      desc: "Providing professional training programs to drive growth and career advancement.",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14L12 14C9.23858 14 7 11.7614 7 9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9C17 11.7614 14.7614 14 12 14Z" stroke="#F57C00" strokeWidth="2"/>
          <path d="M7 14L5 20L12 17L19 20L17 14" stroke="#F57C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      btn: "Enroll Now"
    },
    {
      title: "Certifications",
      desc: "Globally recognized certifications to validate your skills and boost your profile.",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="4" width="14" height="16" rx="2" stroke="#F57C00" strokeWidth="2"/>
          <path d="M9 8H15" stroke="#F57C00" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 12H15" stroke="#F57C00" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="15" cy="18" r="3" fill="#F57C00"/>
        </svg>
      ),
      btn: "Book Now"
    },
    {
      title: "Placements",
      desc: "Connecting you with top industry leaders and career opportunities.",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" stroke="#F57C00" strokeWidth="2"/>
          <path d="M8 5V3H16V5" stroke="#F57C00" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 10V14" stroke="#F57C00" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      btn: "Explore"
    },
    {
      title: "Product Development",
      desc: "Innovative product development services to bring your ideas to life.",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L4 7L12 11L20 7L12 3Z" stroke="#F57C00" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M4 12L12 16L20 12" stroke="#F57C00" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M4 17L12 21L20 17" stroke="#F57C00" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      ),
      btn: "Contact Us"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 px-8 py-3 rounded-full bg-[#121212] border border-white/5 shadow-2xl flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="border-2 border-orange-500 p-1 px-3 rounded-sm">
                <span className="text-orange-500 font-extrabold text-2xl tracking-tight">TECHWING</span>
            </div>
            <div className="hidden lg:block h-8 w-px bg-white/20 mx-1"></div>
            <div className="leading-none hidden lg:block">
                <p className="text-[10px] text-white/60 tracking-[0.2em] uppercase font-black">Innovative Solutions</p>
            </div>
          </div>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide">
            <a href="#" className="text-yellow-400">Home</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">Activities</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">Courses</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">Certification <span className="text-[10px]">▼</span></a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">Placements</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">Team</a>
          </div>
        </div>

        <button 
          onClick={() => setShowLogin(true)}
          className="bg-[#FBC02D] hover:bg-[#F9A825] text-black px-8 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 text-center max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-black text-gray-900 mb-6 tracking-tight"
        >
          Our Offerings
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
        >
          We are committed to providing top-tier services that drive growth, innovation, and professional advancement. Here's what we offer:
        </motion.p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {offerings.map((o, i) => (
          <motion.div
            key={o.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-[0_30px_70px_-15px_rgba(249,115,22,0.15)] transition-all duration-500"
          >
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-8 border border-gray-50 group-hover:bg-orange-50 transition-colors">
              {o.icon}
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">{o.title}</h3>
            <p className="text-sm text-gray-400 mb-8 leading-loose">{o.desc}</p>
            <button className="mt-auto px-10 py-3 bg-[#E65100] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#BF360C] transition-colors shadow-lg shadow-orange-900/10">
              {o.btn}
            </button>
          </motion.div>
        ))}
      </section>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-md bg-[#121212] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl"
            >
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
              >
                ✕
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">Portal Login</h2>
                <p className="text-xs text-white/30 mt-2 uppercase tracking-widest">Enter authentication details</p>
                <div className="mt-6 h-px w-12 mx-auto bg-orange-500" />
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                   <input
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                    placeholder="PIN Number"
                    value={formData.pin}
                    onChange={e => setFormData({ ...formData, pin: e.target.value })}
                    required
                  />
                  <select
                    className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                    value={formData.branch}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    required
                  >
                    <option value="" disabled>Branch</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <input
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <input
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-900/20 disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Enter Portal'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-gray-100 text-center">
            <p className="text-xs font-bold text-gray-300 uppercase tracking-[0.3em]">© 2026 Techwing. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
