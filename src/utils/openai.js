import { OpenAI } from "openai";

// Set up the OpenAI client with your API key and the OpenRouter URL
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY, // Replace this with your real API key
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
  dangerouslyAllowBrowser: true, // This lets it run in a browser (not secure for real apps)
});

// Define a function to get a health prediction
export const getPrediction = async (age, category, probDescrip, medication) => {
  // Create a simple prompt to ask the API for a prediction
  const prompt = `Summarize the health condition of a ${age}-year-old with ${category} symptoms. Issue: ${probDescrip}. Medication: ${
    medication || "None"
  }. I’d suggest giving a short, easy-to-follow explanation to make it nice and clear!`;

  // Try to make the API call
  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // Replace this with the real model name from OpenRouter's docs if needed
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300, // Limits the response length
      temperature: 0.7, // Controls creativity (0 to 1, 0.7 is balanced)
    });

    // Get the prediction description from the response
    const description = response.choices[0]?.message?.content?.trim();

    // Check if we got a valid prediction
    if (!description) {
      return {
        description: "No valid prediction received from the model",
        confidence: 0.85,
        riskLevel: "moderate",
      };
    }

    // Determine confidence and riskLevel based on category
    let confidence, riskLevel;
    const lowerCategory = category.toLowerCase();

    switch (lowerCategory) {
      case "anxiety":
      case "depression":
      case "stress":
      case "ptsd":
        confidence = 0.65; // 70% confidence
        riskLevel = "moderate";
        break;
      case "loneliness":
      case "mild stress":
      case "fatigue":
        confidence = 0.75; // 70% confidence
        riskLevel = "low";
        break;
      case "heart":
      case "cardiovascular":
      case "hypertension":
        confidence = 0.5; // 50% confidence
        riskLevel = "high";
        break;
      case "diabetes":
      case "blood sugar":
      case "insulin resistance":
        confidence = 0.55; // 50% confidence
        riskLevel = "moderate";
        break;
      case "obesity":
      case "high cholesterol":
        confidence = 0.6; // 60% confidence
        riskLevel = "high";
        break;
      case "migraine":
      case "headache":
        confidence = 0.7; // 60% confidence
        riskLevel = "low";
        break;
      default:
        confidence = 0.85; // Default 85% confidence
        riskLevel = "moderate";
        break;
    }

    // Return an object with description, confidence, and riskLevel
    return { description, confidence, riskLevel };
  } catch (error) {
    // If something goes wrong, log it and return an error object
    console.error("Error getting prediction:", error.message);
    return {
      description: "Error getting prediction: " + error.message,
      confidence: 0.85,
      riskLevel: "moderate",
    };
  }
};
