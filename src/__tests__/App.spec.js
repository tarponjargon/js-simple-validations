import puppeteer from "../../node_modules/puppeteer";
import cfg from '../config';

const path = require('path');
const APP = `file:${path.join(__dirname, '../../demo.html')}`;
const formSelector = `[${cfg.formValidateAttr}]`;

const toValidate = [{
		name: 'Invalid E-Mail',
		type: 'invalid',
		testVal: 'test@test.',
		selector: 'input[name=Login]',
		expectMessage: 'Please check your E-Mail format'
	},{
		name: 'Valid E-Mail',
		type: 'valid',
		testVal: 'yardy@yarr.com',
		selector: 'input[name=Login]'
	},{
		name: 'Invalid Password',
		type: 'invalid',
		testVal: '123Ab',
		selector: 'input[name=Password]',
		expectMessage: 'Should be between 6 and 20 characters'
	},{
		name: 'Valid Password',
		type: 'valid',
		testVal: '123ABc',
		selector: 'input[name=Password]'
	},{
		name: 'Empty Confirm Password',
		type: 'invalid',
		testVal: '',
		selector: 'input[name=ConfirmPassword]',
		expectMessage: "This field can't be empty"
	},{
		name: 'Non-Matching Confirm Password',
		type: 'invalid',
		testVal: '123ABC',
		selector: 'input[name=ConfirmPassword]',
		expectMessage: "Does not match Desired Password"
	},{
		name: 'Valid Confirm Password',
		type: 'valid',
		testVal: '123ABc',
		selector: 'input[name=ConfirmPassword]'
	},{
		name: 'Invalid Customer Number',
		type: 'invalid',
		testVal: '123Ab',
		selector: 'input[name=customerNumber]',
		expectMessage: 'Should be a number'
	},{
		name: 'Valid Customer Number',
		type: 'valid',
		testVal: '123456',
		selector: 'input[name=customerNumber]'
	},{
		name: 'Invalid Dealer Number',
		type: 'invalid',
		testVal: '123Ab',
		selector: 'input[name=aad]',
		expectMessage: 'Should be a 4 character number'
	},{
		name: 'Valid Dealer Number',
		type: 'valid',
		testVal: '1234',
		selector: 'input[name=aad]'
	},{
		name: 'Optional field should contain the phrase "twelve" (if it has a value)',
		type: 'invalid',
		testVal: '  ',
		selector: 'input[name=random]',
		expectMessage: 'Should contain "twelve"'
	},{
		name: 'Optional field can be empty',
		type: 'valid',
		testVal: '',
		selector: 'input[name=random]'
	},{
		name: 'Optional field contains the phrase "twelve"',
		type: 'valid',
		testVal: 'randy rando twelve two five nine',
		selector: 'input[name=random]'
	},{
		name: 'Invalid date field',
		type: 'invalid',
		testVal: '10/16/2006',
		selector: 'input[name=dateField]',
		expectMessage: 'Must match pattern YYYY-MM-DD'
	},{
		name: 'Date field valid',
		type: 'valid',
		testVal: '2010-10-16',
		selector: 'input[name=dateField]'
	},{
		name: 'Invalid URL field',
		type: 'invalid',
		testVal: 'yardy yar yar yarr',
		selector: 'input[name=url]',
		expectMessage: 'Please enter a valid URL (starts with "http" or "https")'
	},{
		name: 'Valid url field',
		type: 'valid',
		testVal: 'https://www.yakimaherald.com/classifieds/sale/furniture/',
		selector: 'input[name=url]'
	},{
		name: 'Invalid Random Textarea field',
		type: 'invalid',
		testVal: ' 	',
		selector: 'textarea[name=random-textarea]',
		expectMessage: "This field can't be empty"
	},{
		name: 'Invalid Random Textarea field',
		type: 'valid',
		testVal: 'yardy yar yar yarr',
		selector: 'textarea[name=random-textarea]'
	},{
		name: 'Invalid card type',
		type: 'invalid',
		testVal: '',
		selector: 'select[name=cardType]',
		expectMessage: "Please select a card type"
	},{
		name: 'Valid card type',
		type: 'valid',
		testVal: 'VI',
		selector: 'select[name=cardType]'
	},{
		name: 'Invalid Credit Card',
		type: 'invalid',
		testVal: '4122344512348765',
		selector: 'input[name=cardNumber]',
		expectMessage: "Please enter a valid credit card number (no spaces)"
	},{
		name: 'Valid Credit Card',
		type: 'valid',
		testVal: '4111111111111111',
		selector: 'input[name=cardNumber]'
	},{
		name: 'Empty CVV',
		type: 'invalid',
		testVal: '',
		selector: 'input[name=cardCvv]',
		expectMessage: "This field can't be empty"
	},{
		name: 'Invalid CVV',
		type: 'invalid',
		testVal: '1 234 5',
		selector: 'input[name=cardCvv]',
		expectMessage: "Should be a number between 3 and 4 characters"
	},{
		name: 'Valid CVV',
		type: 'valid',
		testVal: '1234',
		selector: 'input[name=cardCvv]'
	},{
		name: 'No month selected',
		type: 'invalid',
		testVal: '',
		selector: 'select[name=expirationMonth]',
		expectMessage: "Select a month"
	},{
		name: 'Month is selected',
		type: 'valid',
		testVal: '04',
		selector: 'select[name=expirationMonth]'
	},
];

// puppeteer setup
let page;
let browser;
const width = 1000;
const height = 1000;

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

// helper functions for the window scope
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
	window.inputType = (selector) => {
		return document.querySelector(selector).type;
	};

};

// test suite
describe("Demo form", async () => {

	// TODO test for ConfirmPassword dependent validator

	// TODO test for expiredate validator

	// TODO test check/uncheck/check checkboxes ensure validations update

	// TODO test form validates, change a value and is invalid, then correct value

	// TODO test callbacks work

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
				await page.evaluate(() => window.scrollBy(0, window.innerHeight));
				await page.focus(t.selector);
				await page.type(t.selector, t.testVal);
				await page.evaluate(selector => window.unFocus(selector), t.selector);
				await page.waitForFunction((args) => {
					return window.getContainer(args[0], 'invMessage').innerText === args[1];
				}, {}, [t.selector, t.expectMessage]);
			}, 4000);
		}

		if (t.type === 'valid') {
			test(t.name, async () => {
				await page.evaluate(selector => window.clearField(selector), t.selector);
				const fieldType = await page.evaluate(selector => window.inputType(selector), t.selector);
				console.log("fieldType", fieldType);
				await page.focus(t.selector);
				if (fieldType === 'select-one') {
					await page.select(t.selector, t.testVal);
				} else {
					await page.type(t.selector, t.testVal);
				}
				await page.evaluate(selector => window.unFocus(selector), t.selector);
				await page.waitForSelector(t.selector + '['+cfg.fieldIsValid+']');
			}, 4000);
		}

	});
});
