import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      name,
      email,
      phone,
      company,
      description,
      hoursWasted,
      yearlyHoursSaved,
      annualSavings,
      contactDate,
      contactTime
    } = req.body;

    const timestamp = new Date().toLocaleString();

    // Safely escape cells for direct Excel alignment
    const escapeCSV = (val) => {
      if (val === undefined || val === null) return '';
      let str = String(val);
      str = str.replace(/"/g, '""');
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

    // In a serverless environment (like Vercel), writing to the local codebase directory is read-only.
    // We attempt to write to /tmp as a safe sandbox fallback to prevent crashes.
    const leadsFilePath = path.join('/tmp', 'leads.csv');

    let fileExists = false;
    try {
      fileExists = fs.existsSync(leadsFilePath);
    } catch (e) {
      console.warn('[Vercel Serverless] Local filesystem access restricted:', e.message);
    }

    try {
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
      fs.appendFileSync(leadsFilePath, row, 'utf8');
      console.log('[Vercel Serverless] Lead successfully logged in serverless memory buffer (/tmp/leads.csv)');
    } catch (fsErr) {
      console.warn('[Vercel Serverless] Read-only directory. Skipped physical file output:', fsErr.message);
    }

    // Print details in logs for easy retrieval from the Vercel dashboard!
    console.log(`\n====================================`);
    console.log(`[NEW LEAD CAPTURED ON VERCEL SERVERLESS]`);
    console.log(`👤 Name: ${name}`);
    console.log(`🏢 Company: ${company}`);
    console.log(`📧 Email: ${email}`);
    console.log(`📞 Phone: ${phone}`);
    console.log(`⏳ Wasted Hours: ${hoursWasted} hrs/week`);
    console.log(`💰 Forecasted Savings: $${annualSavings?.toLocaleString() || 0}/year`);
    console.log(`📅 Call Scheduled: ${contactDate} at ${contactTime}`);
    console.log(`✍️ Bottleneck: "${description}"`);
    console.log(`====================================\n`);

    // Resilient server-side Discord Webhook push
    // This allows the user to simply add DISCORD_WEBHOOK_URL to their Vercel environment variables!
    // It keeps their Discord token 100% secure since it is never exposed to front-end Javascript.
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: "Cygnus Lead Bot",
            embeds: [{
              title: "🚨 New Cygnus Lead & Call Booked! (Vercel Serverless)",
              color: 1030655, // Cyber Purple
              fields: [
                { name: "👤 Name", value: name || "N/A", inline: true },
                { name: "🏢 Company", value: company || "N/A", inline: true },
                { name: "📧 Email", value: email || "N/A", inline: true },
                { name: "📞 Phone", value: phone || "N/A", inline: true },
                { name: "⏳ Manual Wasted Hours", value: `${hoursWasted || 0} hrs/week`, inline: true },
                { name: "💰 Forecasted Savings", value: `$${(annualSavings || 0).toLocaleString()}/year`, inline: true },
                { name: "📅 Preferred Schedule", value: `${contactDate} at ${contactTime}`, inline: false },
                { name: "✍️ Operational Bottleneck", value: description || "N/A", inline: false }
              ],
              timestamp: new Date().toISOString()
            }]
          })
        });

        if (response.ok) {
          console.log('[Discord Webhook] Push notifications dispatched successfully.');
        } else {
          console.error('[Discord Webhook Error] Response code:', response.status);
        }
      } catch (webhookErr) {
        console.error('[Discord Webhook Error] Failed to connect to Discord endpoint:', webhookErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Assessment completed and logged successfully.'
    });

  } catch (error) {
    console.error('[Serverless Handler Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process lead calculation audit.'
    });
  }
}
