/**
 * AutomateFlow Client Side Interactivity Script
 * Handles Sticky Navbar, Responsive Menu, Statistics Counters,
 * Live Workflow Visualizer Simulator, Multi-step ROI Audit Calculator,
 * FAQ Accordion, and Scroll-Reveal Observers.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 0. Live Deployment Cloud Integrations (Optional)
  // ==========================================
  const CLOUD_CONFIG = {
    // Option 1: Live Discord Webhook URL for instant mobile/desktop push notifications when leads come in!
    discordWebhookUrl: "", 
    
    // Option 2: Live Supabase Database credentials (for 100% serverless, publish-ready hosting on Vercel/Netlify)
    supabaseUrl: "",
    supabaseAnonKey: ""
  };
  
  // ==========================================
  // 1. Sticky Navigation & Active States
  // ==========================================
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');
  const navLinksList = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Toggle sticky glass look
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Dynamic Navigation active class highlight on scroll
    let currentSectionId = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop;
      const sectionHeight = sec.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinksList.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 2. Responsive Mobile Menu Hamburg
  // ==========================================
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    // Close mobile nav when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 3. Floating Counter Animations
  // ==========================================
  const animateCounter = (elementId, targetVal, incrementStep, durationMs) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    let currentVal = 0;
    const intervalMs = 20;
    const totalSteps = durationMs / intervalMs;
    const stepValue = Math.ceil(targetVal / totalSteps);

    const counterInterval = setInterval(() => {
      currentVal += stepValue;
      if (currentVal >= targetVal) {
        el.textContent = targetVal.toLocaleString() + '+';
        clearInterval(counterInterval);
      } else {
        el.textContent = currentVal.toLocaleString() + '+';
      }
    }, intervalMs);
  };

  // Run initial counters on load
  animateCounter('stat-hours', 120, 2, 1800);
  animateCounter('stat-tasks', 18450, 150, 2200);

  // ==========================================
  // 4. Live Workflow Visualizer Simulation Loop
  // ==========================================
  const workflowNodes = [
    { id: 'node-1', detailId: 'node-1-detail', statusId: 'node-1-status', progressId: 'progress-1' },
    { id: 'node-2', detailId: 'node-2-detail', statusId: 'node-2-status', progressId: 'progress-2' },
    { id: 'node-3', detailId: 'node-3-detail', statusId: 'node-3-status', progressId: 'progress-3' },
    { id: 'node-4', detailId: 'node-4-detail', statusId: 'node-4-status', progressId: 'progress-4' },
    { id: 'node-5', detailId: 'node-5-detail', statusId: 'node-5-status', progressId: null }
  ];

  // Dynamic datasets to make simulation loop feel alive and realistic
  const simulationDataVariants = [
    {
      leadDetail: "New inquiry from SaaS founder",
      aiDetail: "Analyzing SaaS billing metrics...",
      crmDetail: "HubSpot Deal created: $12k scope",
      emailDetail: "Sent custom roadmap to Sarah",
      analyticsDetail: "Pipeline metrics updated: +$12,000"
    },
    {
      leadDetail: "Shopify store owner application",
      aiDetail: "Auditing inventory flows...",
      crmDetail: "ActiveCampaign synced: 3 operations flagged",
      emailDetail: "Sent inventory automation brief",
      analyticsDetail: "Fulfillment logs calculated: +140 hrs"
    },
    {
      leadDetail: "Enterprise Operations request",
      aiDetail: "Checking legacy API support...",
      crmDetail: "Salesforce Lead logged & scored",
      emailDetail: "Dispatched SOC2 audit details",
      analyticsDetail: "Dashboard refreshed: 4.2x ROI projected"
    }
  ];

  let currentSimulationIdx = 0;
  let activeSimulationTimeout = null;

  const runWorkflowSimulation = () => {
    const data = simulationDataVariants[currentSimulationIdx];
    
    // Setup initial nodes state
    workflowNodes.forEach((node, index) => {
      const el = document.getElementById(node.id);
      const detailEl = document.getElementById(node.detailId);
      const statusEl = document.getElementById(node.statusId);
      const progressEl = node.progressId ? document.getElementById(node.progressId) : null;
      
      if (!el || !detailEl || !statusEl) return;

      if (index === 0) {
        el.className = "node active";
        detailEl.textContent = data.leadDetail;
        statusEl.textContent = "Triggered";
      } else {
        el.className = "node";
        statusEl.textContent = "Queued";
        if (index === 1) detailEl.textContent = "Analyzing intake data...";
        if (index === 2) detailEl.textContent = "Syncing HubSpot records...";
        if (index === 3) detailEl.textContent = "Drafting outreach proposal...";
        if (index === 4) detailEl.textContent = "Refreshing executive KPIs...";
      }

      if (progressEl) {
        progressEl.style.height = "0%";
      }
    });

    // Step-by-step state progression timing
    const stepDelay = 1800; // ms per node execution

    const proceedToNode = (stepNumber) => {
      if (stepNumber >= workflowNodes.length) {
        // Complete last node and reset after 3 seconds
        activeSimulationTimeout = setTimeout(() => {
          currentSimulationIdx = (currentSimulationIdx + 1) % simulationDataVariants.length;
          runWorkflowSimulation();
        }, 3200);
        return;
      }

      const prevNode = workflowNodes[stepNumber - 1];
      const currentNode = workflowNodes[stepNumber];
      
      const prevEl = document.getElementById(prevNode.id);
      const prevStatusEl = document.getElementById(prevNode.statusId);
      const progressEl = document.getElementById(prevNode.progressId);
      
      const curEl = document.getElementById(currentNode.id);
      const curDetailEl = document.getElementById(currentNode.detailId);
      const curStatusEl = document.getElementById(currentNode.statusId);

      if (!prevEl || !prevStatusEl || !progressEl || !curEl || !curDetailEl || !curStatusEl) return;

      // Animate connecting progress line
      progressEl.style.height = "100%";

      activeSimulationTimeout = setTimeout(() => {
        // Mark previous node completed
        prevEl.className = "node";
        prevStatusEl.textContent = "Completed";

        // Mark current node active
        curEl.className = "node active";
        curStatusEl.textContent = "Active";

        // Update custom detail subtexts dynamically
        if (stepNumber === 1) curDetailEl.textContent = data.aiDetail;
        if (stepNumber === 2) curDetailEl.textContent = data.crmDetail;
        if (stepNumber === 3) curDetailEl.textContent = data.emailDetail;
        if (stepNumber === 4) {
          curDetailEl.textContent = data.analyticsDetail;
          curStatusEl.textContent = "Running";
        }

        // Trigger next node
        proceedToNode(stepNumber + 1);
      }, 700); // Small transition buffer for line fill
    };

    // Trigger step sequence starting at second node
    activeSimulationTimeout = setTimeout(() => {
      proceedToNode(1);
    }, stepDelay);
  };

  // Launch visual simulation
  runWorkflowSimulation();

  // ==========================================
  // 5. Interactive Multi-Step Audit Form
  // ==========================================
  const auditForm = document.getElementById('audit-calculator-form');
  const stepWrapper = document.getElementById('audit-step-wrapper');
  const btnPrev = document.getElementById('btn-audit-prev');
  const btnNext = document.getElementById('btn-audit-next');
  const stepIndicator = document.getElementById('audit-step-indicator');
  const stepPercent = document.getElementById('audit-step-percent');
  const hoursSlider = document.getElementById('audit-hours-slider');
  const hoursDisplay = document.getElementById('range-hours-display');
  
  // Variables for holding calculation state
  let currentStep = 0;

  // Step names & completions
  const stepMeta = [
    { title: "Step 1 of 3: Business Contact Details", percent: "33%" },
    { title: "Step 2 of 3: Manual Process Scoping", percent: "66%" },
    { title: "Step 3 of 3: Preferred Contact Schedule", percent: "100%" }
  ];

  // Update wasted hours range output dynamically
  if (hoursSlider && hoursDisplay) {
    hoursSlider.addEventListener('input', (e) => {
      hoursDisplay.textContent = e.target.value;
    });
  }

  // Set minimum date to today to prevent scheduling in the past
  const dateInput = document.getElementById('audit-contact-date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Calculate calculations & display outputs
  const showAuditResults = () => {
    const userName = document.getElementById('audit-name').value.trim();
    const userEmail = document.getElementById('audit-email').value.trim();
    const userBusiness = document.getElementById('audit-business').value.trim();
    const userPhone = document.getElementById('audit-phone').value.trim();
    const userDescription = document.getElementById('audit-description').value.trim();
    const hoursWasted = parseInt(hoursSlider.value);
    const contactDate = document.getElementById('audit-contact-date').value;
    const contactTime = document.getElementById('audit-contact-time').value;

    // Format readable date and time
    let formattedDate = contactDate;
    try {
      const dateObj = new Date(contactDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      }
    } catch(e) {}

    let formattedTime = contactTime;
    try {
      const [hours, minutes] = contactTime.split(':');
      const hourNum = parseInt(hours);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum % 12 || 12;
      formattedTime = `${displayHour}:${minutes} ${ampm}`;
    } catch(e) {}

    // Keyword Analysis to generate a highly customized and premium operational roadmap recommendation
    const descLower = userDescription.toLowerCase();
    let bottleneckLabel = "Custom Operational Pipeline";
    let recommendationText = "";
    
    if (descLower.includes('crm') || descLower.includes('hubspot') || descLower.includes('salesforce') || descLower.includes('sync')) {
      bottleneckLabel = "CRM Data Sync Automation";
      recommendationText = `We suggest deploying a specialized CRM integration script using secure OAuth standards. This pipeline synchronizes incoming data directly to HubSpot/Salesforce custom properties, removing manual database double-keys, completely eliminating administrative lags, and recovering approx {HOURS} hours annually for your sales managers.`;
    } else if (descLower.includes('lead') || descLower.includes('sales') || descLower.includes('scrape') || descLower.includes('outreach') || descLower.includes('email')) {
      bottleneckLabel = "AI Lead Enrichment Machine";
      recommendationText = `We recommend engineering an autonomous scraper and Large Language Model parser. When a new inbound prospect emerges, the Cygnus agent enriches operational metrics, extracts executive roles, and drafts highly personalized introductory outreach briefs automatically. This boosts pipeline qualification throughput and saves approx {HOURS} hours annually.`;
    } else if (descLower.includes('support') || descLower.includes('customer') || descLower.includes('ticket') || descLower.includes('help') || descLower.includes('chat')) {
      bottleneckLabel = "Intelligent AI Support Agent";
      recommendationText = `We advise structuring a proprietary semantic search (RAG) agent trained safely on your internal database documents and help guides. Resolving 60%+ of standard inquiries instantly and dropping latencies to 3 seconds, this support layer frees your engineers while recovering approx {HOURS} hours annually.`;
    } else if (descLower.includes('excel') || descLower.includes('sheet') || descLower.includes('entry') || descLower.includes('file') || descLower.includes('copy') || descLower.includes('paste')) {
      bottleneckLabel = "Data Pipeline Automation";
      recommendationText = `We suggest establishing an end-to-end automated transfer stack between your file repositories. Fully formatted records transfer instantly on sync schedules with active parity validation, eliminating human copy-paste errors and recovering approx {HOURS} hours annually.`;
    } else {
      bottleneckLabel = "Custom Intelligent Automation";
      recommendationText = `We suggest deploying a custom cognitive loop mapping your team's manual operations. By automating repetitive decision gates and file loads, your operational pipeline will recover significant throughput speed, saving your team approx {HOURS} hours of manual overhead annually.`;
    }

    // Dynamic calculations
    const weeklyHoursSaved = Math.round(hoursWasted * 0.85); // 85% automation efficiency
    const yearlyHoursSaved = weeklyHoursSaved * 52;
    const standardHourlyRate = 45; // $45 hourly blended operations rate
    const estimatedSavings = yearlyHoursSaved * standardHourlyRate;

    // Inject yearly hours inside recommendation
    recommendationText = recommendationText.replace('{HOURS}', yearlyHoursSaved);

    // Show loading state on submit button
    const btnSubmit = document.getElementById('btn-audit-next');
    const originalBtnText = btnSubmit.textContent;
    btnSubmit.textContent = "Computing ROI & Logging Lead...";
    btnSubmit.disabled = true;

    // Resilient submission handler
    const performSubmission = async () => {
      let savedLocally = false;
      let savedCloud = false;

      // 1. Try local server endpoint first
      try {
        const localRes = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userName,
            email: userEmail,
            phone: userPhone,
            company: userBusiness,
            description: userDescription,
            hoursWasted: hoursWasted,
            yearlyHoursSaved: yearlyHoursSaved,
            annualSavings: estimatedSavings,
            contactDate: contactDate,
            contactTime: contactTime
          })
        });
        if (localRes.ok) {
          savedLocally = true;
          console.log('[Local CSV Database] Saved successfully');
        }
      } catch (err) {
        console.warn('[Local Server Offline] Fallback to cloud configurations...');
      }

      // 2. Try Discord Webhook if configured
      if (CLOUD_CONFIG.discordWebhookUrl) {
        try {
          await fetch(CLOUD_CONFIG.discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: "Cygnus Lead Bot",
              embeds: [{
                title: "🚨 New Cygnus Lead & Call Booked!",
                color: 1030655, // Cyber Purple hex
                fields: [
                  { name: "👤 Name", value: userName, inline: true },
                  { name: "🏢 Company", value: userBusiness, inline: true },
                  { name: "📧 Email", value: userEmail, inline: true },
                  { name: "📞 Phone", value: userPhone, inline: true },
                  { name: "⏳ Manual Wasted Hours", value: `${hoursWasted} hrs/week`, inline: true },
                  { name: "💰 Forecasted Savings", value: `$${estimatedSavings.toLocaleString()}/year`, inline: true },
                  { name: "📅 Preferred Schedule", value: `${contactDate} at ${contactTime}`, inline: false },
                  { name: "✍️ Operational Bottleneck", value: userDescription, inline: false }
                ],
                timestamp: new Date().toISOString()
              }]
            })
          });
          savedCloud = true;
          console.log('[Discord Webhook] Lead pushed to channel');
        } catch (e) {
          console.error('[Discord Webhook Error]', e);
        }
      }

      // 3. Try Supabase REST API if configured
      if (CLOUD_CONFIG.supabaseUrl && CLOUD_CONFIG.supabaseAnonKey) {
        try {
          const tableUrl = `${CLOUD_CONFIG.supabaseUrl}/rest/v1/leads`;
          const supabaseRes = await fetch(tableUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': CLOUD_CONFIG.supabaseAnonKey,
              'Authorization': `Bearer ${CLOUD_CONFIG.supabaseAnonKey}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              name: userName,
              email: userEmail,
              phone: userPhone,
              company: userBusiness,
              description: userDescription,
              hours_wasted: hoursWasted,
              yearly_hours_saved: yearlyHoursSaved,
              annual_savings: estimatedSavings,
              contact_date: contactDate,
              contact_time: contactTime
            })
          });
          if (supabaseRes.ok) {
            savedCloud = true;
            console.log('[Supabase DB] Lead saved successfully to cloud');
          }
        } catch (e) {
          console.error('[Supabase Error]', e);
        }
      }

      // Always show results to the user — save to CSV happens silently in background
      auditForm.style.display = "none";
      const resultsEl = document.getElementById('audit-results');
      resultsEl.style.display = "block";

      // Inject data values into results view
      document.getElementById('results-name').textContent = userName;
      document.getElementById('results-company-label').textContent = userBusiness;
      document.getElementById('results-bottleneck-label').textContent = bottleneckLabel;
      document.getElementById('result-hours-saved').textContent = yearlyHoursSaved.toLocaleString() + " Hrs";
      document.getElementById('result-dollars-saved').textContent = "$" + estimatedSavings.toLocaleString();
      document.getElementById('results-recommendation').textContent = recommendationText;
      document.getElementById('results-date-val').textContent = formattedDate;
      document.getElementById('results-time-val').textContent = formattedTime;
      
      // Adjust header indicators
      stepIndicator.textContent = "Assessment Complete";
      stepPercent.textContent = "100% Calculated";

      // Log save status for developer reference
      if (!savedLocally && !savedCloud) {
        console.warn('[Cygnus] Lead could not be saved to CSV. Make sure the server is running via: npm run dev');
      }
    };

    // Execute resilient submission
    performSubmission().finally(() => {
      btnSubmit.textContent = originalBtnText;
      btnSubmit.disabled = false;
    });
  };

  // Move form slider wrapper
  const updateSlidePosition = () => {
    stepWrapper.style.transform = `translateX(-${currentStep * 33.333}%)`;
    
    // Toggle navigation back visibility
    if (currentStep === 0) {
      btnPrev.style.visibility = "hidden";
    } else {
      btnPrev.style.visibility = "visible";
    }

    // Toggle next text on final step
    if (currentStep === 2) {
      btnNext.textContent = "Compute Savings ROI";
    } else {
      btnNext.textContent = "Continue";
    }

    // Adjust titles indicators
    stepIndicator.textContent = stepMeta[currentStep].title;
    stepPercent.textContent = stepMeta[currentStep].percent;
  };

  // Navigations event bindings
  if (btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
      // Step 0 validation: Contact info check
      if (currentStep === 0) {
        const nameField = document.getElementById('audit-name');
        const emailField = document.getElementById('audit-email');
        const businessField = document.getElementById('audit-business');
        const phoneField = document.getElementById('audit-phone');

        if (!nameField.value.trim() || !emailField.value.trim() || !businessField.value.trim() || !phoneField.value.trim()) {
          alert('Please fill out all contact and business details to continue.');
          return;
        }

        // Validate basic email format
        if (!emailField.value.includes('@') || !emailField.value.includes('.')) {
          alert('Please provide a valid work email address.');
          return;
        }
      }

      // Step 1 validation: Custom textarea check
      if (currentStep === 1) {
        const descField = document.getElementById('audit-description');

        if (!descField.value.trim() || descField.value.trim().length < 10) {
          alert('Please describe your operational manual bottleneck or automation request in a few words (at least 10 characters).');
          return;
        }
      }

      // Step 2 validation: Schedule date/time check
      if (currentStep === 2) {
        const dateField = document.getElementById('audit-contact-date');
        const timeField = document.getElementById('audit-contact-time');

        if (!dateField.value || !timeField.value) {
          alert('Please pick your preferred follow-up date and time to finish your scoping audit.');
          return;
        }

        // Validate that the selected date and time are not in the past
        const selectedDateTime = new Date(`${dateField.value}T${timeField.value}`);
        const now = new Date();

        if (selectedDateTime <= now) {
          alert('No meeting can be scheduled in the past. Please select a future date and time.');
          return;
        }

        // Compute findings & submit
        showAuditResults();
        return;
      }

      // Advance step
      currentStep++;
      updateSlidePosition();
    });

    btnPrev.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateSlidePosition();
      }
    });
  }

  // ==========================================
  // 6. Smooth FAQ Accordion Heights Transitions
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all open FAQs
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Toggle current FAQ
      if (!isActive) {
        item.classList.add('active');
        // Set maximum heights dynamically to enable CSS animation transition
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 7. Intersection Observer for Scroll Reveals
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.12, // Element is 12% visible before triggering
      rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits viewport center
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback support if intersection observer is missing
    revealElements.forEach(el => el.classList.add('revealed'));
  }

});
