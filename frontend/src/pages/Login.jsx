import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-900/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="border-2 border-orange-500 p-1 px-3 rounded-sm">
              <span className="text-orange-500 font-extrabold text-2xl tracking-tight">TECHWING</span>
            </div>
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">Assessment Cloud</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#121212] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
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
        </div>

        <p className="text-center mt-8 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">© 2026 TECHWING. All Rights Reserved.</p>
      </motion.div>
    </div>
  );
}
