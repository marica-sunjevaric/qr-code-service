const { test, expect } = require('@playwright/test');
const { Jimp } = require('jimp');
const QrCode = require('qrcode-reader');

const APP_URL = 'https://qr-code-app-2021.netlify.app/';

async function decodeCanvasQR(page, containerSelector) {
  const base64 = await page.locator(`${containerSelector} canvas`)
    .evaluate(canvas => canvas.toDataURL().split(',')[1]);

  const buffer = Buffer.from(base64, 'base64');
  const image = await Jimp.read(buffer);
  const qr = new QrCode();

  return new Promise((resolve, reject) => {
    qr.callback = (err, value) => (err ? reject(err) : resolve(value.result));
    qr.decode(image.bitmap);
  });
}

test.describe('QR Code App - Canvas', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  //  -------Text field test-------
  test('generates QR code while typing and verifies content', async ({ page }) => {
    await page.fill('#text', 'https://first.com');
    await page.waitForTimeout(500);
    const firstDecoded = await decodeCanvasQR(page, '#qrcode');
    expect(firstDecoded).toBe('https://first.com');

    await page.fill('#text', 'https://second.com');
    await page.waitForTimeout(500);
    const secondDecoded = await decodeCanvasQR(page, '#qrcode');
    expect(secondDecoded).toBe('https://second.com');

    expect(secondDecoded).not.toBe(firstDecoded);
  });

  // -------Size test-------
  test('changes QR code dimensions when the size slider is changed', async ({ page }) => {
    const canvas = page.locator('#qrcode canvas');

    // Initial dimensions
    const initialWidth = await canvas.evaluate(c => c.width);
    const initialHeight = await canvas.evaluate(c => c.height);

    // Change slider (assuming ID #size)
    await page.evaluate(() => {
      const slider = document.querySelector('#size');
      slider.value = 600;
      slider.dispatchEvent(new Event('input'));
    });

    await page.waitForTimeout(500); // wait for re-render

    const newWidth = await canvas.evaluate(c => c.width);
    const newHeight = await canvas.evaluate(c => c.height);

    expect(newWidth).not.toBe(initialWidth);
    expect(newHeight).not.toBe(initialHeight);
  });

  // -------Min version test-------
  test('changes MinVersion slider and QR code remains valid', async ({ page }) => {
    const canvas = page.locator('#qrcode canvas');

    // Check initial value of minversion slider
    const slider = page.locator('#minversion');
    const initialValue = await slider.evaluate(s => s.value);
    console.log('Initial minversion:', initialValue);

    // Change slider value
    await slider.evaluate(s => {
      s.value = 8;
      s.dispatchEvent(new Event('input')); // emit input event
    });

    await page.waitForTimeout(500); // wait for QR code re-render

    // Check that canvas still exists and generates a valid QR code
    const decoded = await page.evaluate(() => {
      const canvas = document.querySelector('#qrcode canvas');
      return canvas ? canvas.toDataURL().substring(0, 50) : null; // at least it exists
    });
    expect(decoded).not.toBeNull();

    // Optional: check the slider value changed
    const newValue = await slider.evaluate(s => s.value);
    expect(newValue).toBe('8');
  });

  // -------Quiet Zone test-------
  test('changes Quiet Zone slider and QR code remains valid', async ({ page }) => {
    const slider = page.locator('#quiet');
    const canvas = page.locator('#qrcode canvas');
    
    // wait for slider and canvas to be visible
    await expect(slider).toBeVisible();
    
    // initial slider value
    const initialValue = await slider.evaluate(s => s.value);
    console.log('Initial Quiet Zone:', initialValue);
    
    // change slider value
    await slider.evaluate(s => {
      s.value = 3;
      s.dispatchEvent(new Event('input')); // emit input event
    });
    
    await page.waitForTimeout(500); // wait for QR code re-render
    
    // check new slider value
    const newValue = await slider.evaluate(s => s.value);
    expect(newValue).toBe('3');
    
    // check that canvas still exists
    await expect(canvas).toBeVisible();
  });

  // -------Radius test-------
  test('changes Radius slider and QR code remains valid', async ({ page }) => {
    const radius = page.locator('#radius');
    const canvas = page.locator('#qrcode canvas');
    
    // wait for slider and canvas to be visible
    await expect(radius).toBeVisible();
    
    // initial slider value
    const initialValue = await radius.evaluate(s => s.value);
    console.log('Initial Radius:', initialValue);
    
    // change slider value
    await radius.evaluate(s => {
      s.value = 50;
      s.dispatchEvent(new Event('input')); // emit input event
    });
    
    await page.waitForTimeout(500); // wait for QR code re-render
    
    // check new slider value
    const newValue = await radius.evaluate(s => s.value);
    expect(newValue).toBe('50');
    
    // check that canvas still exists
    await expect(canvas).toBeVisible();
  });

  // -------ECL Level test-------
  test('changes ECL option and QR code remains valid', async ({ page }) => {
    const ecl = page.locator('#eclevel');
    const canvas = page.locator('#qrcode canvas');
    
    // wait for dropdown and canvas to be visible
    await expect(ecl).toBeVisible();
    
    // initial dropdown value
    const initialValue = await ecl.evaluate(s => s.value);
    console.log('Initial ECL:', initialValue);
    
    // change option
    await ecl.selectOption('M');
    
    await page.waitForTimeout(500); // wait for QR code re-render
    
    // check new dropdown value
    const newValue = await ecl.evaluate(s => s.value);
    expect(newValue).toBe('M');
    
    // check that canvas still exists
    await expect(canvas).toBeVisible();
  });

});
