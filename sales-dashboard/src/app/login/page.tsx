'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { login } from '../actions';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(password);
    if (result.success) {
      router.push('/');
      router.refresh();
    } else {
      setError('Incorrect Password');
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-neutral-800 p-4 rounded-full">
             <Lock className="w-8 h-8 text-neutral-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-2">Restricted Access</h1>
        <p className="text-neutral-500 text-center mb-8 text-sm">Enter the access code to view the dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password"
            placeholder="Access Code"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <div className="text-red-500 text-sm text-center font-bold px-2 py-1 bg-red-900/20 rounded border border-red-900/50">{error}</div>}
          
          <button 
            type="submit"
            className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-lg transition-colors"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
