import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Recipe {
  name: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
}

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY as string;
console.log(API_KEY);
console.log(import.meta.env.VITE_SOME_KEY); // "123"

export const getRecipe = async (
  ingredients: string[]
): Promise<Recipe | null> => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Generate a recipe in JSON format using these ingredients: ${ingredients.join(", ")}.
    The JSON should have the following structure:
    {
        "name": "Recipe Name",
        "ingredients": [
            { "name": "Ingredient 1", "amount": "Quantity and unit" },
            { "name": "Ingredient 2", "amount": "Quantity and unit" }
        ],
        "steps": [
            "Step 1",
            "Step 2",
            "Step 3"
        ]
    }
    Provide ONLY the valid JSON response. DO NOT include any markdown code blocks, or any other text before or after the JSON.
`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    return JSON.parse(text) as Recipe;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
};
