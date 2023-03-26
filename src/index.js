const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

// Define endpoint to take a screenshot
app.get('/screenshot', async (req, res) => {
    const { url, width = 850, height = 400, pick = null } = req.query;

    // Launch a new browser instance
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
        ],
    });

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url);

    // Set the viewport size
    await page.setViewport({
        width: Number(width),
        height: Number(height)
    });

    let screenshotOpts;
    if (pick !== null) {
        await page.waitForSelector(pick);
        let hero = await page.$(pick);
        let box = await hero.boundingBox();

        let x = box['x'];
        let y = box['y'];
        let w = box['width'];
        let h = box['height'];
        screenshotOpts = {
            clip: {
                x: x,
                y: y,
                width: w,
                height: h
            }
        }
    }

    // Take a screenshot
    const screenshot = screenshotOpts !== undefined ? await page.screenshot(screenshotOpts) : await page.screenshot();

    // Close the browser instance
    await browser.close();

    // Return the screenshot as a response
    res.type('image/png');
    res.send(screenshot);
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
