// Recipe.js
import React, { useState } from 'react';
import axios from 'axios';
import './Recipe.css'; // Assuming you still want to use this for styling

const Recipe = () => {
  const [ingredients, setIngredients] = useState(''); // User input for ingredients
  const [data, setData] = useState(null); // Recipe list
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Stores selected recipe details
  const [loading, setLoading] = useState(false); // Loading state for search and fetch
  const [error, setError] = useState(null); // Error state

  const API_KEY = process.env.REACT_APP_API_KEY;

  // API URL to find recipes by ingredients
  const SEARCH_API_URL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}`;
  
  // API URL to get recipe details by ID
  const getRecipeDetailsUrl = (id) => 
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;

  // Fetch list of recipes based on ingredients
  const fetchRecipes = async () => {
    if (!ingredients) {
      setError({ message: "Please enter ingredients" });
      return;
    }

    setLoading(true);
    setError(null); // Reset error state before fetching

    try {
      const response = await axios.get(SEARCH_API_URL);
      setData(response.data); // Set recipe list
      setSelectedRecipe(null); // Reset selected recipe if any
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false); // End loading state after fetching
    }
  };

  // Fetch recipe details based on selected recipe ID
  const fetchRecipeDetails = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(getRecipeDetailsUrl(id));
      setSelectedRecipe(response.data); // Set selected recipe details
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setIngredients(e.target.value);
  };

  return (
    <div className="recipe-container">
      <input
        type="text"
        placeholder="Enter ingredients (comma separated)"
        value={ingredients}
        onChange={handleInputChange}
        className="ingredient-input"
      />
      <button onClick={fetchRecipes} className="search-button">
        Search for a Recipe
      </button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {/* Show list of recipes */}
      {data && !selectedRecipe && data.length > 0 && (
        <div className="recipe-list">
          {data.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-result"
              onClick={() => fetchRecipeDetails(recipe.id)} // Fetch details on click
              style={{ cursor: 'pointer' }}
            >
              <h1>{recipe.title}</h1>
              <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            </div>
          ))}
        </div>
      )}

      {/* Show selected recipe details */}
      {selectedRecipe && (
        <div className="recipe-details">
          <h1>{selectedRecipe.title}</h1>
          <img src={selectedRecipe.image} alt={selectedRecipe.title} className="recipe-image" />
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {selectedRecipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
          <h2>Instructions</h2>
          <p className="instructions">{selectedRecipe.instructions}</p>
          {/* Optional: Add a back button to return to the recipe list */}
          <button onClick={() => setSelectedRecipe(null)}>Back to list</button>
        </div>
      )}
    </div>
  );
};

export default Recipe;
