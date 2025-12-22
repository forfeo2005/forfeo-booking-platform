import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useLocation } from 'wouter';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', orgName: '', email: '', password: '' });
  const [error, setError] = useState('');
  
  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: () => {
      window.location.href = '/'; 
    },
    onError: (e) => setError(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer votre compte Forfeo</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom complet</label>
            <input type="text" className="w-full border p-2 rounded" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Nom de l'entreprise</label>
            <input type="text" className="w-full border p-2 rounded" 
              value={formData.orgName} onChange={e => setFormData({...formData, orgName: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="w-full border p-2 rounded" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input type="password" className="w-full border p-2 rounded" 
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>
          <button type="submit" disabled={signupMutation.isPending} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
             S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
