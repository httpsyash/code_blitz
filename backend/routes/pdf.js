import express from "express";
const router = express.Router();
import puppeteer from 'puppeteer';

router.post('/generate-pdf', async (req, res) => {
  const { htmlContent } = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: 'new', // for newer versions of Puppeteer
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=summary.pdf',
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('Error generating PDF');
  }
});

export default router
