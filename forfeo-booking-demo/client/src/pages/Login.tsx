import { useState } from 'react';
import { trpc } from '../utils/trpc'; // Ajuste l'import selon ton projet
import { useLocation } from 'wouter';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      // Invalider le cache 'me' pour mettre à jour l'UI
      window.location.href = '/'; // Hard reload pour être sûr que le cookie est pris en compte
    },
    onError: (e) => setError(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion Forfeo</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input 
              type="email" 
              className="w-full border p-2 rounded" 
              value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input 
              type="password" 
              className="w-full border p-2 rounded" 
              value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {loginMutation.isPending ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>
        <div className="mt-4 text-center">
            <a href="/signup" className="text-blue-600 hover:underline">Pas de compte ? Créer une entreprise</a>
        </div>
      </div>
    </div>
  );
}
