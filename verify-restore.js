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

  console.log("--- VISITING RESTORED TANSTACK APP (localhost:8080) ---");
  
  let connected = false;
  for (let i = 0; i < 10; i++) {
    try {
      await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
      connected = true;
      break;
    } catch (e) {
      console.log("Waiting for server...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  if (!connected) {
    console.log("Could not connect to dev server.");
    process.exit(1);
  }

  await new Promise(r => setTimeout(r, 2000));

  console.log("\n--- BROWSER CONSOLE OUTPUT ---");
  if (errors.length === 0) {
    console.log("✅ CONSOLE IS CLEAN (No Firebase or Hydration errors)");
  } else {
    console.log("❌ DETECTED ERRORS:");
    errors.forEach(e => console.log(`  - ${e}`));
  }

  const title = await page.title();
  console.log(`\nPage Title: ${title}`);
  
  const hasOper8a = await page.evaluate(() => document.body.innerText.toLowerCase().includes('oper8a'));
  console.log(`Oper8a Branding Found: ${hasOper8a ? 'YES' : 'NO'}`);

  await browser.close();
  process.exit(errors.length === 0 ? 0 : 1);
})();
