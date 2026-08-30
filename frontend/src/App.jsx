import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Feed from './pages/Feed.jsx'; 
import CreateRecipe from './pages/createRecipes.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/RegisterUser.jsx'

// 1. Create a simple "Navbar" so we can navigate
function Navbar() {
  return (
    <nav style={{ padding: '15px', background: '#333', color: '#fff', marginBottom: '20px' }}>
      <Link to="/" style={{ color: '#fff', marginRight: '20px' }}>Home</Link>
      <Link to="/login" style={{ color: '#fff', marginRight: '20px' }}>Login</Link>
      <Link to="/create" style={{ color: '#ffd700', fontWeight: 'bold',marginRight: '20px' }}>+ Upload Recipe</Link>
      <Link to="/profile" style={{ color: '#ecece7', marginRight: '20px' }}>Profile</Link>
      <Link to='/register' style={{ color: '#ecece7', marginRight: '20px' }}>Register yourself</Link>
    </nav>
  );
}
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />    
      </Routes>
    </Router>
  );
}

export default App;