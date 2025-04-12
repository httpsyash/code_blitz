// 📁 controllers/suggestionsController.js
import openai from "../config.js/openai.js";

export const getSuggestions = async (req, res) => {
  try {
    const { materials, labour, totalCost } = req.body;

    // Build a dynamic user prompt string
    let materialLines = Object.entries(materials).map(([key, value]) => {
      if (key === "water") {
        return `- Water: ₹${value.quantity}`;
      }
      return `- ${capitalizeFirstLetter(key)}: ${value.quantity} units at ₹${value.rate}/unit`;
    });

    const labourLines = labour
      .filter(item => item.days > 0 && item.rate > 0)
      .map(item => `- ${capitalizeFirstLetter(item.type)}: ${item.days} days × ₹${item.rate}/day`);

    const userPrompt = `
I am building a house with the following material quantities and costs:
${materialLines.join('\n')}
${labourLines.length ? '\nIncluding labour:\n' + labourLines.join('\n') : ''}

Total estimated cost: ₹${totalCost.toFixed(2)}

Please suggest optimizations and cost-saving alternatives.
`;

    const systemPrompt = `
You are a construction cost optimization expert.

Reply ONLY in valid JSON format (no markdown, no explanations) with this format for each category:

{
  "Bricks": {
    "current": "376609 × ₹7 = ₹26.36 Lakhs",
    "alternative": "AAC Blocks (600×200×200mm)",
    "suggestion": "Use AAC blocks to replace red bricks (~7 bricks/block)",
    "estimated_savings": "₹6–8 Lakhs",
    "benefits": ["Lightweight", "Less mortar usage", "Insulation"]
  },
  ...
  "Summary": {
    "Bricks (AAC)": "₹6–8 Lakhs",
    "Cement (PPC)": "₹29,000",
    "Steel": "₹15,000–₹30,000",
    "Water": "₹10,000",
    "Labour": "₹5,000–₹10,000",
    "Sand + Aggregate": "₹2,000–₹5,000",
    "Design tweaks": "₹20,000–₹50,000",
    "Total Savings": "₹7.5–9.5 Lakhs"
  }
}

Use lakhs/₹ format for all money values. 
Quote all JSON keys. Do NOT include any text outside the JSON block.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    let suggestions = response.choices[0].message.content;
    try {
      suggestions = JSON.parse(suggestions); // Convert if it's a valid JSON string
    } catch (e) {
      // Return raw string if JSON.parse fails
    }

    res.json({ suggestions });

  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.status(500).json({ error: "Failed to get suggestions from OpenAI." });
  }
};

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
