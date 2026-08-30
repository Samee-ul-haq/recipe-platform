import { useState } from 'react';
import api from '../api'; // Import your axios helper
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { email, password });
      
      
      // 2. SAVE IT (The most important part!)
      localStorage.setItem('user',JSON.stringify(response.data.user))
      
      alert('User registered Successful!');
      navigate('/'); // Redirect to Home Feed
      
    } catch (err) {
      setError(err.response?.data?.message || 'User register failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>registerUser</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleCreateUser}>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          registerUser
        </button>
      </form>
    </div>
  );
}

export default Register;