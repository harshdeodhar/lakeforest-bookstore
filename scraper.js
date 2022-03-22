const puppeteer = require('puppeteer')
const random_useragent = require('random-useragent')
const fs = require('fs')
const { url } = require('./config')

;(async () => {
  // Open Browser
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Setup Browser
  await page.setDefaultTimeout(15000)
  await page.setViewport({ width: 1200, height: 800 })
  await page.setUserAgent(random_useragent.getRandom())

  //Launching Website and getting Data
  await page.goto(url)
  await page.waitForSelector('#block-aba-product-browse-ababook-browse > div')

  //Selecting Genre as Drama
  await page.click('#block-aba-product-browse-ababook-browse > div > div > ul > li:nth-child(7) > a')
  await page.waitForSelector('#post-content > h1')
  const tableBody='#block-system-main > div > div > div.view-content > table > tbody';

  //Helps Store Data into Text File
  const logger = fs.createWriteStream('log.txt', { flags: 'a' })

  for(let row=1;row<=3;row++){
      for(let col=1;col<=3;col++){
        const boxSelector = `${tableBody} > tr.row-${row} > td.col-${col}`;
        const bookName =  await page.$eval(`${boxSelector} > div:nth-child(2) > span > a`, e => e.innerText);
        const authorName =  await page.$eval(`${boxSelector} > div:nth-child(3) > span > a`, e => e.innerText);
        const price = await page.$eval(`${boxSelector} > div:nth-child(4) > span`, e => e.innerText);
        logger.write(`Book No. ${(row-1)*3+col}:- `)
        logger.write(` BookName: ${bookName}\n`)
        logger.write(`  Author: ${authorName}\n`)
        logger.write(`  Price: ${price}\n`)
    }
  }

  logger.close()

  // Close Browser
  await browser.close()
})().catch(error => {
  console.log(error)
  process.exit(1)
})
