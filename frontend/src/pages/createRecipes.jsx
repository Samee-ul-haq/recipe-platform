import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function CreateRecipe() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(''); // We'll let them type "Flour, Sugar"
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Create the FormData object (Required for files)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image); // Append the raw file

    // 2. Handle Ingredients
    // User types "Flour, Sugar", we turn it into an array ["Flour", "Sugar"]
    const ingArray = ingredients.split(',').map(item => item.trim());
    
    // Append each ingredient separately so Multer sees it as an array
    ingArray.forEach(ing => {
      formData.append('ingredients', ing);
    });

    try {
      // 3. Send Request with Token
      const token = localStorage.getItem('token');
      
      await api.post('/recipes', formData, {
        headers: {
          'Authorization': `Bearer ${token}`, // The Key 🔑
        }
      });

      alert('Recipe Created!');
      navigate('/'); // Go back home to see it

    } catch (err) {
      console.error(err);
      alert('Failed to upload');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🍳 Upload New Recipe</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
        
        <input 
          placeholder="Title (e.g., Spicy Pasta)" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
        />
        
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
        />

        <input 
          placeholder="Ingredients (comma separated: Flour, Eggs, Milk)" 
          value={ingredients} 
          onChange={e => setIngredients(e.target.value)} 
        />

        {/* File Input */}
        <input 
          type="file" 
          onChange={e => setImage(e.target.files[0])} // Store the file object
          required
        />

        <button type="submit">Upload Recipe</button>
      </form>
    </div>
  );
}

export default CreateRecipe;