/*
 * Install dependencies:
 * npm install
 *
 * Run:
 * node ok.js
 *    or
 * HEADLESS=false node ok.js
 *
 */

const puppeteer = require('puppeteer');
const _ = require('lodash');

const url = "https://www.supremenewyork.com/shop/sweatshirts/stmvghrqd"
const headless = (process.env.HEADLESS == 'false') ? false : true;
let browser, page;

beforeAll(async ()=>{
  // disable sandbox, otherwise Linux requires extra packages to be installed
  //browser = await puppeteer.launch({args: ['--auto-open-devtools-for-tabs', '--no-sandbox', '--disable-setuid-sandbox', '--cast-initial-screen-width=1920'], headless: headless});
  browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--cast-initial-screen-width=1920'], headless: headless});
  page = await browser.newPage();
  /* Set initial screen width (above in puppeteer.launch), and viewport size because otherwise important elements are hidden and can't be clicked on
   * We don't fully support mobile views after all. Come back to this when we do.
   */
  page.setViewport({width:1920, height:1280});

  // 10 second timeout for async callbacks
  jest.setTimeout(20000);

  // Print console.log's from the browser process
  page.on('console', msg => {
    for (let i = 0; i < msg.args.length; ++i){
      console_arg = msg.args[i];
      if(console_arg.constructor.name == 'JSHandle'){
        console.log(console_arg._remoteObject.value);
      }
      else{
        console.log(console_arg);
      }
    }
  });

  // Print stack traces when there are unhandled exceptions inside of the browser process
  page.on('pageerror', msg => {
    console.log(msg);
  });
});

afterAll(async ()=>{
  if(headless){
    await browser.close();
  }
});

describe('does the thing', ()=>{
  test('go to page, wait for add to cart button, click it', async ()=>{
    await page.goto(`${url}`);
    await page.waitForSelector('#add-remove-buttons input.button');
    await page.click('#add-remove-buttons input.button');
  });
  test('wait for checkout button, click it', async ()=>{
    await page.waitForSelector('a.button.checkout');
    await page.click('a.button.checkout');
  });
  test('fill in billing name', async ()=>{
    await page.waitForFunction(()=>{
      return document.getElementById("order_billing_name");
    });
    await page.evaluate(()=>{
      $('#order_billing_name').val("UH HUH");
    });
    await page.waitForFunction(()=>{
      return document.getElementById("order_email");
    });
    await page.evaluate(()=>{
      $('#order_email').val("test@gmail.com");
    });
    await page.waitForFunction(()=>{
      return $("#order_tel").length > 0;
    });
    await page.evaluate(()=>{
      $('#order_tel').val("123-123-1234");
    });
    await page.waitForFunction(()=>{
      return $("#bo").length > 0;
    });
    await page.evaluate(()=>{
      $('#bo').val("99 spring st.");
    });
    await page.waitForFunction(()=>{
      return $("#order_billing_zip").length > 0;
    });
    await page.evaluate(()=>{
      $('#order_billing_zip').val("10003");
    });
    await page.waitForFunction(()=>{
      return $("#order_billing_city").length > 0;
    });
    await page.evaluate(()=>{
      $('#order_billing_city').val("New York");
    });
    await page.waitForFunction(()=>{
      return $("#nnaerb").length > 0;
    });
    await page.evaluate(()=>{
      $('#nnaerb').val("1234-1234-1234-4321");
    });
    await page.waitForFunction(()=>{
      return $("#orcer").length > 0;
    });
    await page.evaluate(()=>{
      $('#orcer').val("123");
    });
    await page.evaluate(()=>{
      $('#cart-cc > fieldset > p:nth-child(4) > label > div > ins').click()
    });
    await page.evaluate(()=>{
      $('#pay > input').click()
    });
  })
});
