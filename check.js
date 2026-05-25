import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => {
    errors.push(err.toString());
  });

  console.log("--- VISITING LANDING PAGE ---");
  await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
  
  // Basic checks
  const checks = {};
  
  checks['Aurora Canvas Exists'] = await page.$('canvas') !== null;
  checks['Navbar Visible'] = await page.$('nav') !== null;
  checks['Connect Wallet CTA Exists'] = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.innerText.includes('Connect Wallet'));
  });
  checks['Stats Strip Exists'] = await page.evaluate(() => {
    return document.body.innerText.includes('ms') && document.body.innerText.includes('Verifiable');
  });
  checks['Footer OPER8A Wordmark'] = await page.evaluate(() => {
    const h2s = Array.from(document.querySelectorAll('h2'));
    return h2s.some(h => h.innerText.toLowerCase().includes('oper8a'));
  });

  console.log("Landing Page Checks:");
  for (const [k, v] of Object.entries(checks)) {
    console.log(`- ${k}: ${v ? 'PASS' : 'FAIL'}`);
  }

  // Click Connect Wallet
  console.log("\\n--- TESTING WALLET MODAL ---");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const connectBtn = btns.find(b => b.innerText.includes('Connect Wallet'));
    if (connectBtn) connectBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  const modalChecks = {};
  modalChecks['WalletSelector Opened'] = await page.evaluate(() => document.body.innerText.includes('Choose a wallet'));
  modalChecks['Phantom Option Visible'] = await page.evaluate(() => document.body.innerText.includes('Phantom'));
  
  for (const [k, v] of Object.entries(modalChecks)) {
    console.log(`- ${k}: ${v ? 'PASS' : 'FAIL'}`);
  }

  console.log("\\n--- VISITING DASHBOARD DIRECTLY ---");
  await page.goto('http://localhost:8080/dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  const dashChecks = {};
  dashChecks['Redirected to Landing?'] = page.url() === 'http://localhost:8080/';
  
  for (const [k, v] of Object.entries(dashChecks)) {
    console.log(`- ${k}: ${v ? 'PASS' : 'FAIL'}`);
  }

  // Simulate localstorage to test dashboard
  await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('walletConnected', 'true');
    localStorage.setItem('walletAddress', '7xK...mock');
  });
  await page.goto('http://localhost:8080/dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const dashLoggedChecks = {};
  dashLoggedChecks['Video Background Exists'] = await page.$('video') !== null;
  dashLoggedChecks['Network Manager Visible'] = await page.evaluate(() => document.body.innerText.includes('Networks'));
  dashLoggedChecks['File Upload Visible'] = await page.evaluate(() => document.body.innerText.includes('Upload & Anchor'));
  dashLoggedChecks['Storage Visible'] = await page.evaluate(() => document.body.innerText.includes('Storage'));
  
  for (const [k, v] of Object.entries(dashLoggedChecks)) {
    console.log(`- ${k}: ${v ? 'PASS' : 'FAIL'}`);
  }

  console.log("\\n--- CONSOLE ERRORS ---");
  if (errors.length === 0) console.log("No console errors detected.");
  else errors.forEach(e => console.log("ERROR:", e));

  await browser.close();
})();
