import { useEffect, useState } from 'react';
import api from '../api';

function Feed() {
  const [recipes, setRecipes] = useState([]);
  const [search,setSearch]=useState('')
  const [chef,setChef]=useState('')

  // 1. Fetch Data on Load
    const fetchRecipes = async () => {
      try {
        let url='/recipes'
        if(search) 
          url+=`?search=${search}`
        if(chef)
          url+=`?chef=${chef}`

        const response = await api.get(url);
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    // To make funtion accessible
  useEffect(() => {
    fetchRecipes();
  }, [search,chef]);
  
  return (
    
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div className="search-bar">
    <input 
        type="text" 
        placeholder="Search for recipes..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
        
    />
    <button onClick={fetchRecipes}>Search</button>
    </div>
    <div>
      <label>Select chefID</label>
      <select
       value={chef} 
       onChange={(e)=> setChef(e.target.value)}>
        <option value="">--Select ChefID</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
       </select>
    </div>
      <h1>🍲 Community Recipes</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        
        {recipes.map((recipe) => (
          <div key={recipe.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            
            {/* IMAGE HANDLING */}
            {recipe.image_url && (
              <img 
                // We must add the backend URL because the DB only stores '/uploads/file.jpg'
               src={`http://localhost:3000${recipe.image_url.replace(/\\/g, "/").replace("src","")}`}
                alt={recipe.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
              />
            )}

            <div style={{ padding: '15px' }}>
              <h3>{recipe.title}</h3>
              <p style={{ color: '#555' }}>{recipe.description}</p>
              <small>Chef ID: {recipe.user_id}</small>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Feed;