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

	window.clearField = (selector) => {
		return document.querySelector(selector).value = '';
	}
	window.getContainer = (selector, cfgKey) => {
		let thisField = (selector) ? document.querySelector(selector) : null;
		let targetId = (thisField) ? thisField.getAttribute(cfg[cfgKey]) : null;
		return (targetId) ? document.querySelector('#' + targetId) : null;
	};
	window.unFocus = (selector) => {
		return document.querySelector(selector).blur();
	};

};

const toValidate = [
	{
		name: 'Invalid E-Mail',
		type: 'invalid',
		testVal: 'test@test.',
		selector: 'input[name=Login]',
		expectMessage: 'Please check your E-Mail format',
		timeout: 3000
	},
	{
		name: 'Valid E-Mail',
		type: 'valid',
		testVal: 'yardy@yarr.com',
		selector: 'input[name=Login]',
		validSelector: 'input[name=Login]['+cfg.fieldIsValid+']',
		timeout: 3000
	},
	{
		name: 'Invalid Password',
		type: 'invalid',
		testVal: '123Ab',
		selector: 'input[name=Password]',
		expectMessage: 'Should be between 6 and 20 characters',
		timeout: 3000
	},
	{
		name: 'Valid Password',
		type: 'valid',
		testVal: '123ABc',
		selector: 'input[name=Password]',
		validSelector: 'input[name=Password]['+cfg.fieldIsValid+']',
		timeout: 3000
	},
	{
		name: 'Empty Confirm Password',
		type: 'invalid',
		testVal: '',
		selector: 'input[name=ConfirmPassword]',
		expectMessage: "This field can't be empty",
		timeout: 3000
	},
	{
		name: 'Non-Matching Confirm Password',
		type: 'invalid',
		testVal: '123ABC',
		selector: 'input[name=ConfirmPassword]',
		expectMessage: "Does not match Desired Password",
		timeout: 3000
	},
	{
		name: 'Valid Confirm Password',
		type: 'valid',
		testVal: '123ABc',
		selector: 'input[name=ConfirmPassword]',
		validSelector: 'input[name=ConfirmPassword]['+cfg.fieldIsValid+']',
		timeout: 3000
	},
];

describe("Demo form", async () => {

	test("Form loads", async () => {
		page.on('console', msg => console.log('PAGE LOG:', msg.text()));
		await page.goto(APP);
		await page.evaluate(helperFunctions, cfg);
		await page.waitForSelector(formSelector);
	});

	// loop thru field validation collection
	toValidate.forEach(t => {

		if (t.type === 'invalid') {
			test(t.name, async () => {
				await page.evaluate(selector => window.clearField(selector), t.selector);
				await page.click(t.selector);
				await page.type(t.selector, t.testVal);
				await page.evaluate(selector => window.unFocus(selector), t.selector);
				await page.waitForFunction((args) => {
					return window.getContainer(args[0], 'invMessage').innerText === args[1];
				}, {}, [t.selector, t.expectMessage]);
			}, t.timeout);
		}

		if (t.type === 'valid') {
			test(t.name, async () => {
				await page.evaluate(selector => window.clearField(selector), t.selector);
				await page.click(t.selector);
				await page.type(t.selector, t.testVal);
				await page.evaluate(selector => window.unFocus(selector), t.selector);
				await page.waitForSelector(t.validSelector);
			}, t.timeout);
		}

	});
});
