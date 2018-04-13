import puppeteer from "../../node_modules/puppeteer";
import cfg from '../config';
import FieldValidator from '../field-validator';

const path = require('path');
const APP = `file:${path.join(__dirname, '../../demo.html')}`;

const data = {
  formId: 'test-email',
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

const helperFunctions = (cfg) => {

		window.getElement = (selector) => {
			return (selector) ? document.querySelector(selector) : null;
		};

		window.getWait = (selector) => {
			let el = window.getElement(selector);
			let cdb = el.getAttribute(cfg.fieldDebounce);
			let db = (cdb) ? cdb : cfg.debounceDefault;
			return db + 100;
		};

		window.getErrorText = function(selector) {
			console.log("IN GETERRORC", selector);
			let el = window.getElement(selector);
			var ec = null;
			var id = el.getAttribute(cfg.invMessage);
			var cc = (id) ? document.querySelector('#' + id) : null;
			if (cc) {
				ec = cc;
			} else {
				ec = (el.parentNode.nextElementSibling.classList.contains(cfg.fieldError.className)) ?
					  el.parentNode.nextElementSibling :
					  null;
			}
			console.log("in getErrorText return", ec.innerText);
			return (ec) ? ec.innerText : null;
		};
};

let formSelector = `[${cfg.formValidateAttr}]`;


describe("Demo form", async() => {

	test("Valid e-mail", async () => {
		await page.goto(APP);
		await page.waitForSelector(formSelector);
		await page.click("input[name=Login]");
		await page.type("input[name=Login]", data.email);
		await page.waitForSelector("input[name=Login]["+cfg.fieldIsValid+"]");
	}, 2000);
	test("Invalid e-mail", async() => {
		page.on('console', msg => console.log('PAGE LOG:', msg.text()));
		let selector = 'input[name=Login]';
		let expectStr = 'Please check your E-Mail format';
		await page.goto(APP);
		await page.evaluate(helperFunctions, cfg);
		await page.click(selector);
		await page.type(selector, data.badEmail);
		const waitLength = await page.evaluate(selector => {
			return window.getWait(selector);
		},selector);
		console.log("waitLength", waitLength);
		await page.waitFor(waitLength);
		const text = await page.evaluate(selector => {
			return window.getErrorText(selector);
		}, selector);
		console.log("text", text);
		//expect(text).toBe('Please check your E-Mail format');
		expect(text).toBe(expectStr);
	}, 2000);
});
