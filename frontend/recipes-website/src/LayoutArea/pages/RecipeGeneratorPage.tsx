import React, { useState } from "react";
import { getRecipe, Recipe } from "../../utils/googleAi";
import userBackground from "../../assets/user-profile-background1.png";
import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";

const RecipeGenerator: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>("");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);

    const ingredientList = ingredients.split(",").map((ing) => ing.trim());
    const generatedRecipe = await getRecipe(ingredientList);

    setRecipe(generatedRecipe);
    setLoading(false);
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex justify-center"
      style={{ backgroundImage: `url(${userBackground})` }}
    >
      <div className="w-full max-w-3xl pt-[8%] flex justify-between flex-col">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Recipe Generator
          </h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter ingredients (comma-separated)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleGenerateRecipe}
            className={`flex items-center justify-center ml-[40%] gap-2 px-5 py-2.5 text-md font-medium rounded-lg transition-all duration-300
        ${
          loading
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
        }`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Get Recipe"}
            <AutoFixNormalIcon className="w-5 h-5 text-white opacity-90" />
          </button>
        </div>
        {recipe && (
          <div className="max-h-[400px] overflow-y-auto scroll-container pr-2">
            <h3 className="text-2xl text-center font-bold text-gray-800 mb-4">
              {recipe.name}
            </h3>

            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              Ingredients:
            </h4>
            <ul className="list-disc list-inside pl-4 text-gray-600">
              {recipe.ingredients.map((ing, index) => (
                <li key={index} className="mb-1">
                  {ing.name}: <strong>{ing.amount}</strong>
                </li>
              ))}
            </ul>

            <h4 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
              Steps:
            </h4>
            <ol className="list-decimal list-inside pl-4 text-gray-600">
              {recipe.steps.map((step, index) => (
                <li key={index} className="mb-2">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeGenerator;
