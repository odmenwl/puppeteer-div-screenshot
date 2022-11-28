import * as puppeteer from 'puppeteer';

import { CONFIG } from './config';
import { clearDirectory } from './clear-directory';
import { extractImages } from './extract-images';


async function start () {
  console.debug('clearing directory');
  await clearDirectory(CONFIG.IMAGE_DIR);

  console.debug('starting browser');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 1080,
      width: 1920,
    },
  });
  const page = await browser.newPage();
  await page.goto(CONFIG.URL, {
    waitUntil: 'networkidle2',
  });

  console.debug('starting take screenshot');
  const screenshot = await page.screenshot({
    fullPage: true,
    encoding: 'binary',
  });

  console.debug('starting make blocks');
  const blocks = await Promise.all(
    await page.$$(CONFIG.BLOCK_SELECTOR)
  );
  const blockModels = await Promise.all(
    blocks.map(async (div) => {
      const { height, width, y, x } = await div.boundingBox();
      const header = await div.$(CONFIG.BLOCK_TEXT_SELECTOR);
      const title = await (await header.getProperty('textContent')).jsonValue() || '';

      return {
        height,
        width,
        top: y,
        left: x,
        title,
      }
    }).filter(Boolean)
  );

  console.debug('extracting', blockModels);
  await extractImages(screenshot, blockModels, CONFIG.IMAGE_DIR)

  await browser.close();
}

start();
