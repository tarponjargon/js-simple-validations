import puppeteer from "../../node_modules/puppeteer";
import cfg from '../config';

const path = require('path');
const APP = `file:${path.join(__dirname, '../../demo.html')}`;
const formSelector = `[${cfg.formValidateAttr}]`;

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

// helper functions for the window scope, used in page.evaluate test scope
const helperFunctions = (cfg) => {

		// calc wait time based on field debounce specification
		window.getWait = (selector) => {
			let el = document.querySelector(selector);
			let cdb = (el) ? el.getAttribute(cfg.fieldDebounce) : null;
			let db = (cdb) ? cdb : cfg.debounceDefault;
			return db + 200;
		};

		window.getErrorId = function(selector) {
			return window.getContainerId(document.querySelector(selector), cfg.invMessage, cfg.errorIdPrefix)
		};

		window.getValidationId = function(selector) {
			return window.getContainerId(document.querySelector(selector), cfg.valTarget, cfg.wrapperIdPrefix)
		};


		// find this field's error container and get its text
		window.getInnerText = function(selector) {
			let el = document.querySelector(selector);
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
			return (ec) ? ec.innerText : null;
		};

		window.getContainerId = function(field, custom, assigned) {
			/*
				custom = the cfg var (ex: cfg.invMessage) that if exists will contain the custom container target ID
				assigned = the cfg var (ex: cfg.errorIdPrefix) containing the key to the auto-assigned container target ID
			*/
			var ec = null;
			// if there is a custom target cfgured for the container AND it exists, use that otherwise use assigned
			var id = (custom) ? field.getAttribute(custom) : null;
			var cc = (id) ? document.querySelector('#' + id) : null;
			if (cc) {
				ec = cc;
			} else {
				var s = (assigned) ? '#' + assigned + field.getAttribute(cfg.baseId) : null;
				ec = (s) ? document.querySelector(s) : null;
			}
			return (ec) ? ec.getAttribute('id') : null;
		};
};

describe("Demo form", async() => {

	// enter a valid email, test passes when the cfg.fieldIsValid data attribute
	// appears on field
	test("Valid e-mail", async () => {
		await page.goto(APP);
		await page.waitForSelector(formSelector);
		await page.click("input[name=Login]");
		await page.type("input[name=Login]", 'test@testy.net');
		await page.waitForSelector("input[name=Login]["+cfg.fieldIsValid+"]");
	}, 2000);

	// enter an invalid email, test passes when correct error message shown
	test("Invalid e-mail", async() => {
		page.on('console', msg => console.log('PAGE LOG:', msg.text()));
		let selector = 'input[name=Login]';
		let expectStr = 'Please check your E-Mail format';
		await page.goto(APP);
		await page.evaluate(helperFunctions, cfg);
		await page.click(selector);
		await page.type(selector, 'test@test.');
		const waitLength = await page.evaluate(selector => {
			return window.getWait(selector);
		},selector);
		await page.waitFor(waitLength);
		const text = await page.evaluate(selector => {
			return window.getErrorText(selector);
		}, selector);
		expect(text).toBe(expectStr);
	}, 2000);
});
