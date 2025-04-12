// 📁 server.js
// 🚀 Main Express server entry point
import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import costRoutes from "./routes/costRoutes.js"
import gptRoutes from "./routes/suggestions.js"
import pdfRoute from './routes/pdf.js'
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
 


app.use("/api/cost", costRoutes);
app.use('/api', gptRoutes);

app.use('/api', pdfRoute);



app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});
