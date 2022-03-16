const puppeteer = require('puppeteer')

describe('Lakeforest Bookstore Test', () => {
  it('should launch the browser', async function(){
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto('http://lakeforestbookstore.com/')
    await page.waitForSelector('#logo')
    await browser.close()
  })
})
