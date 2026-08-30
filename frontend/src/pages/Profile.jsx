import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Profile() {
  // IMPROVEMENT 1: Initialize from LocalStorage immediately (No "Loading" flash)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [myRecipes, setMyRecipes] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  // HELPER: Fix Image URLs (Works for Windows backslashes & 'src' folder)
  const getImageUrl = (path) => {
    if (!path) return;
    return `http://localhost:3000/${path.replace(/\\/g, '/').replace('src/', '')}`;
  };

  // 1. Check Auth & Fetch Recipes
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyRecipes = async () => {
      try {
        // Fetch recipes created by this specific user
        const res = await api.get(`/recipes?chef=${user.id}`);
        setMyRecipes(res.data);
      } catch (err) {
        console.error('Failed to fetch recipes', err);
      }
    };

    fetchMyRecipes();
  }, [user, navigate]); // Added 'user' to dependency array

  // 2. Avatar Upload Handler
  const handleAvatarChange = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile); 

    try {
      const token = localStorage.getItem('token');
      
      const res = await api.post('/auth/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Axios usually handles this, but explicit is okay here
        },
      });

      // Update State & LocalStorage immediately
      const updatedUser = { ...user, avatar: res.data.avatar };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('Profile photo updated!');
      setAvatarFile(null); // Clear the file input state
    } catch (err) {
      console.error(err);
      alert('Failed to update profile photo');
    }
  };

  // 3. Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null; // Or a spinner, but usually instant now

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Profile</h1>
        <button
          onClick={handleLogout}
          style={{ background: '#ff4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      {/* PROFILE CARD */}
      <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        
        {/* Use the Helper Function for the Avatar */}
        <img
          src={getImageUrl(user.avatar)}
          alt="Profile"
          style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
        />

        <h2 style={{ margin: '10px 0 5px 0' }}>{user.email}</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>User ID: {user.id}</p>

        {/* Upload Form */}
        <form onSubmit={handleAvatarChange} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <input
            type="file"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            accept="image/*" // Restrict to images only
            style={{ fontSize: '0.9rem' }}
          />
          <button 
            type="submit" 
            style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Update Photo
          </button>
        </form>
      </div>

      {/* MY RECIPES SECTION */}
      <h2 style={{ marginTop: '40px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        My Recipes ({myRecipes.length})
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {myRecipes.length === 0 ? (
          <p>No recipes yet. Go upload one!</p>
        ) : (
          myRecipes.map((recipe) => (
            <div key={recipe.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              
              {/* IMPROVEMENT 2: Display Recipe Image */}
              {recipe.image_url && (
                <img
                  src={getImageUrl(recipe.image_url)}
                  alt={recipe.title}
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
              )}
              
              <div style={{ padding: '10px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{recipe.title}</h4>
                <small style={{ color: '#888' }}>{new Date(recipe.created_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Profile;