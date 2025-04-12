import { calculateMaterialCost } from "../utils/rateDATA.js";

export const estimateCost = (req, res) => {
  console.log("it is working")
  try {
    const inputs = req.body;

    // ✅ Basic validation (add more if needed)
    if (
      !inputs.length || !inputs.breadth || !inputs.height ||
      !inputs.floors || !inputs.brickThickness || !inputs.wallThickness ||
      !inputs.rates
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ Do the cost calculation
    const totalCost = calculateMaterialCost(inputs);

    // ✅ Respond with result
    res.status(200).json({ success: true, totalCost });

  } catch (error) {
    console.error("❌ Error estimating cost:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
