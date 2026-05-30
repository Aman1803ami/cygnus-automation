import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Serve static files from public/ folder (images, etc.)
  app.use(express.static(path.join(__dirname, 'public')));

  const leadsFilePath = path.join(__dirname, 'leads.csv');

  // Print exact database path on startup
  console.log(`\x1b[36m[Database Path] Local leads spreadsheet located at:\x1b[0m\n👉 \x1b[4m${leadsFilePath}\x1b[0m\n`);

  // API lead endpoint for registering audit submissions
  app.post('/api/audit', (req, res) => {
    const { name, email, phone, company, description, hoursWasted, yearlyHoursSaved, annualSavings, contactDate, contactTime } = req.body;

    const timestamp = new Date().toLocaleString();

    // Safely escape cells for direct Excel alignment
    const escapeCSV = (val) => {
      if (val === undefined || val === null) return '';
      let str = String(val);
      // Escape double quotes inside columns
      str = str.replace(/"/g, '""');
      // If column contains commas, newlines or quotes, surround it in double quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str}"`;
      }
      return str;
    };

    const row = [
      escapeCSV(timestamp),
      escapeCSV(name),
      escapeCSV(email),
      escapeCSV(phone),
      escapeCSV(company),
      escapeCSV(description),
      escapeCSV(hoursWasted),
      escapeCSV(yearlyHoursSaved),
      escapeCSV(annualSavings),
      escapeCSV(contactDate),
      escapeCSV(contactTime)
    ].join(',') + '\n';

    const fileExists = fs.existsSync(leadsFilePath);

    try {
      // Write headers if new leads file
      if (!fileExists) {
        const headers = [
          '"Submission Timestamp"',
          '"Contact Name"',
          '"Work Email"',
          '"Phone Number"',
          '"Company Name"',
          '"Bottleneck / Scoping description"',
          '"Weekly Manual Hours"',
          '"Projected Yearly Hours Saved"',
          '"Estimated Annual Savings ($)"',
          '"Preferred Contact Date"',
          '"Preferred Contact Time"'
        ].join(',') + '\n';
        fs.writeFileSync(leadsFilePath, headers, 'utf8');
      }

      // Append lead row to leads.csv
      fs.appendFileSync(leadsFilePath, row, 'utf8');
      
      // NOTIFY backend/terminal immediately with rich visual formatting
      console.log(`\n\x1b[42m\x1b[30m[NEW AUDIT SUBMISSION CAPTURED]\x1b[0m`);
      console.log(`👤 \x1b[1mName:\x1b[0m ${name}`);
      console.log(`🏢 \x1b[1mCompany:\x1b[0m ${company}`);
      console.log(`📧 \x1b[1mEmail:\x1b[0m ${email}`);
      console.log(`📞 \x1b[1mPhone:\x1b[0m ${phone}`);
      console.log(`⏳ \x1b[1mWasted Hours:\x1b[0m ${hoursWasted} hrs/week`);
      console.log(`💰 \x1b[1mEstimated Savings:\x1b[0m $${annualSavings.toLocaleString()}/year`);
      console.log(`📅 \x1b[1mPreferred Call:\x1b[0m ${contactDate} at ${contactTime}`);
      console.log(`✍️ \x1b[1mBottleneck:\x1b[0m "${description}"`);
      console.log(`\x1b[32m✓ Successfully saved to leads.csv\x1b[0m\n`);
      
      res.status(200).json({
        success: true,
        message: 'Assessment logged successfully to leads.csv'
      });
    } catch (err) {
      console.error('\x1b[31m[CSV Database Error]\x1b[0m', err);
      res.status(500).json({
        success: false,
        message: 'Failed to write lead data row'
      });
    }
  });

  // Only serve production build if --prod flag or NODE_ENV=production is set
  const isProduction = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';

  if (isProduction) {
    console.log(`\x1b[32m[Mode] Serving High-Performance Production Build (Published-Level Ready) 🚀\x1b[0m`);
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    console.log(`\x1b[33m[Mode] Serving Development mode with Live Reload 🛠️\x1b[0m`);
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'html'
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    // Fallback wildcard index.html handler in dev mode
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  const PORT = process.env.PORT || 5173;
  app.listen(PORT, () => {
    console.log(`\x1b[36m[Server] Running on http://localhost:${PORT}\x1b[0m\n`);
  });
}

startServer();
