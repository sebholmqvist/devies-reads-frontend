import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import { parseJwt } from '../utils/jwt';

type LoginResponse = {
  token?: string;
  accessToken?: string;
  access_token?: string;
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<LoginResponse>('/auth/login', {
        username,
        password,
      });
      const data  = res.data;
      const token = data.token ?? data.accessToken ?? data.access_token;
      if (!token) {
        throw new Error('Token saknas i svaret');
      }
      // Spara token och userId
      localStorage.setItem('token', token);
      const payload = parseJwt(token);
      const userId  = typeof payload.sub === 'string' ? payload.sub : payload.id;
      if (userId) {
        localStorage.setItem('userId', userId);
      }
      localStorage.setItem('username', username); // Spara användarnamn
      setError('');
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string }).message;
        setError(msg ?? 'Fel användarnamn eller lösenord');
      } else {
        setError('Fel användarnamn eller lösenord');
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Logga in</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Användarnamn</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Lösenord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Logga in
        </button>
      </form>
    </div>
  );
}
