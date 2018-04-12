import puppeteer from "../../node_modules/puppeteer";

const path = require('path');
const APP = `file:${path.join(__dirname, '../../demo.html')}`;

const data = {
  email: 'test@testy.com',
  badEmail: 'test@test.',
  password: "Pa$$w0rD",
  badPassword: "",
  confirmPassword: "Pa$$w0rD",
  badConfirmPassword: "Pa$$w0r",
  custno: 123456,
  badCustno: "ACR567i",
  aad: 1234,
  badAad: 123,
};

let page;
let browser;
const width = 1200;
const height = 800;

beforeAll(async () => { // eslint-disable-line
	browser = await puppeteer.launch({
		headless: false,
		slowMo: 10,
		args: [`--window-size=${width},${height}`]
	});
	page = await browser.newPage();
	await page.setViewport({ width, height });
});
afterAll(() => { // eslint-disable-line
	browser.close();
});

describe("Demo form", async () => {
	test("Valid e-mail", async () => {
		await page.goto(APP);
		await page.waitForSelector("[data-jsv-form]");
		await page.click("input[name=Login]");
		await page.type("input[name=Login]", data.email);
		await page.waitForSelector("input[name=Login][data-jsv-field-isvalid]");
	}, 2000);
	test("Invalid e-mail", async () => {
		await page.goto(APP);
		await page.waitForSelector("[data-jsv-form]");
		await page.click("input[name=Login]");
		await page.type("input[name=Login]", data.badEmail);
		await page.waitFor(1000);
		const text = await page.evaluate(() => document.querySelector('.validate-field-error-message').innerText);
		expect(text).toBe('Please check your E-Mail format');
	}, 2000);
});
