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
		testVal: '3',
		selector: 'select[name=expirationMonth]'
	},{
		name: 'No year selected',
		type: 'invalid',
		testVal: '',
		selector: 'select[name=expirationYear]',
		expectMessage: "Select a year"
	},{
		name: 'Year selection with year + month in past',
		type: 'invalid',
		testVal: '18',
		selector: 'select[name=expirationYear]',
		expectMessage: "Appears to be expired - please check date"
	},{
		name: 'Month selection with month + year in past',
		type: 'invalid',
		testVal: '2',
		selector: 'select[name=expirationMonth]',
		expectMessage: "Appears to be expired - please check date"
	},{
		name: 'Future year is selected',
		type: 'valid',
		testVal: '2026',
		selector: 'select[name=expirationYear]'
	},{
		name: 'Future (or current) month is selected',
		type: 'valid',
		testVal: '11',
		selector: 'select[name=expirationMonth]'
	},{
		name: 'Valid single checkbox',
		type: 'valid',
		testVal: ' ',
		selector: 'input[name=single]'
	},{
		name: 'Valid subscribe choice - yes',
		type: 'valid',
		testVal: ' ',
		selector: '#test-save-email-yes'
	},{
		name: 'Valid subscribe choice - no',
		type: 'valid',
		testVal: ' ',
		selector: '#test-save-email-no'
	}
];

// puppeteer setup
let page;
let browser;
const width = 1000;
const height = 1000;

beforeAll(async () => { // eslint-disable-line
	browser = await puppeteer.launch({
		headless: false,
		slowMo: 0,
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
		let field = document.querySelector(selector);
		if (field.type === 'select-one') {
			return field.selectedIndex = 0;
		} else if (field.type === 'checkbox' || field.type === 'radio') {
			return field.checked = false;
		} else {
			return field.value = '';
		}
	};
	window.getAttr = (selector, attr) => {
		return document.querySelector(selector).getAttribute(attr);
	};
	window.getContainer = (selector, targetAttr) => {
		let thisField = (selector) ? document.querySelector(selector) : null;
		let targetId = (thisField) ? thisField.getAttribute(targetAttr) : null;
		return (targetId) ? document.querySelector('#' + targetId) : null;
	};
	window.unFocus = (selector) => {
		return document.querySelector(selector).blur();
	};
	window.inputType = (selector) => {
		return document.querySelector(selector).type;
	};
	window.alertBox = (message) => {
		alert(message);
	};
	window.filterClassListFor = (selector, attr, str) => {
		let matcher = new RegExp("^" + str);
		let contains = 0;
		window.getContainer(selector, attr).classList.forEach(c => {
			if (matcher.test(c)) {
				contains++
			}
		});
		return contains;
	};
	window.getWait = (selector) => {
		let el = document.querySelector(selector);
		let cdb = el.getAttribute(cfg.fieldDebounce);
		let db = (cdb) ? cdb : cfg.debounceDefault;
		return db + 100;
	};
	window.enableButton = (selector) => {
		document.querySelector(selector).disabled = false;
		return true;
	};
	window.isDisabled = (selector) => {
		return document.querySelector(selector).disabled;
	};
};

let toValidateCtr = 0;

// test suite
describe("Demo form", async () => {

	test("Form loads", async () => {
		page.on('console', msg => console.log('PAGE LOG:', msg.text()));
		await page.goto(APP);
		await page.evaluate(helperFunctions, cfg);
		await page.waitForSelector(formSelector);
	});

	// field invalid callback
	test("Field invalid callback fires", async () => {
		const selector = 'input[name=Login]';
		const expectMessage = "usernameFail callback fired";
		await page.focus(selector);
		await page.type(selector, "yurdy@yurr.com");
		await page.evaluate(selector => window.unFocus(selector), selector);
		await page.waitForFunction(m => {
			return window.usernameFail().message === m;
		}, {}, expectMessage);
	});

	// field invalid callback
	test("Field valid callback fires", async () => {
		await page.waitFor(2000); // deliberate pause
		const selector = 'input[name=Login]';
		const expectMessage = "usernameSuccess callback fired";
		await page.evaluate(selector => window.clearField(selector), selector);
		await page.focus(selector);
		await page.type(selector, "yardy@yarr.com");
		await page.evaluate(selector => window.unFocus(selector), selector);
		await page.waitForFunction(m => {
			return window.usernameSuccess().message === m;
		}, {}, expectMessage);
	});

	test("Submit button is disabled", async () => {
		const isDisabled = await page.evaluate(s => window.isDisabled(s), 'button[type=submit]');
		expect(isDisabled).toBeTruthy();
	});

	// test dependent validator on confirm password field
	test("Invalid dependent validator on confirm password field", async () => {
		const selector = 'input[name=ConfirmPassword]';
		const expectMessage = "Please complete Desired Password";
		await page.focus(selector);
		await page.type(selector, "yrrrrd");
		await page.evaluate(selector => window.unFocus(selector), selector);
		await page.waitForFunction(([selector, attr, message]) => {
			return window.getContainer(selector, attr).innerText === message;
		}, {}, [selector, cfg.invMessage, expectMessage]);
	});


	test("Form reloads", async () => {
		await page.goto(APP);
		await page.evaluate(helperFunctions, cfg);
		await page.waitForSelector(formSelector);
	});

	// loop thru field validation collection
	toValidate.forEach(t => {

		test(t.name, async () => {
			const fieldType = await page.evaluate(selector => window.inputType(selector), t.selector);
			await page.evaluate(selector => window.clearField(selector), t.selector);
			if (toValidateCtr > 8) {
				await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
			}
			await page.focus(t.selector);
			if (fieldType === 'select-one') {
				await page.select(t.selector, t.testVal);
			} else {
				await page.type(t.selector, t.testVal);
			}
			await page.evaluate(selector => window.unFocus(selector), t.selector);
			if (t.type === 'invalid') {
				await page.waitForFunction(([selector, attr, message]) => {
					return window.getContainer(selector, attr).innerText === message;
				}, {}, [t.selector, cfg.invMessage, t.expectMessage]);
			} else {
				await page.waitForSelector(t.selector + '['+cfg.fieldIsValid+']');
			}
			toValidateCtr++;
		}, 4000);

	});

	test("Invalid multi-value checkbox", async () => {
		const selector = '#test-terms-service';
		const expectMessage = "Please agree to both to continue";
		await page.type(selector, " ");
		await page.waitForFunction(([selector, attr, message]) => {
			return window.getContainer(selector, attr).innerText === message;
		}, {}, [selector, cfg.invMessage, expectMessage]);
	});

	test("Invalid multi-value checkbox 2", async () => {
		const selector = '#test-terms-service-more';
		const selector2 = "#test-terms-service";
		await page.evaluate(selector => window.clearField(selector), selector2);
		const expectMessage = "Please agree to both to continue";
		await page.type(selector, " ");
		await page.waitForFunction(([selector, attr, message]) => {
			return window.getContainer(selector, attr).innerText === message;
		}, {}, [selector, cfg.invMessage, expectMessage]);
	});

	test("Valid multi-value checkbox", async () => {
		const selector = '#test-terms-service';
		const selector2 = '#test-terms-service-more';
		await page.type(selector, " ");
		await page.waitForSelector(selector + '['+cfg.fieldIsValid+']');
		await page.waitForSelector(selector2 + '['+cfg.fieldIsValid+']');
	});

	test("Form is valid", async () => {
		await page.waitForSelector(formSelector + '['+cfg.formIsValid+']');
	});

	test("Un-check multi-value checkbox 1", async () => {
		const selector = '#test-terms-service';
		const expectMessage = "Please agree to both to continue";
		await page.type(selector, " ");
		await page.waitForFunction(([selector, attr, message]) => {
			return window.getContainer(selector, attr).innerText === message;
		}, {}, [selector, cfg.invMessage, expectMessage]);
	});

	test("Form is invalid", async () => {
		const validAttr = await page.evaluate(([selector, attr]) => window.getAttr(selector, attr), ([formSelector, cfg.formIsValid]));
		expect(validAttr).toBeFalsy();
	});

	test("Un-check multi-value checkbox 2", async () => {
		const selector = '#test-terms-service-more';
		const expectMessage = "Please agree to both to continue";
		await page.type(selector, " ");
		await page.waitForFunction(([selector, attr, message]) => {
			return window.getContainer(selector, attr).innerText === message;
		}, {}, [selector, cfg.invMessage, expectMessage]);
	});

	test("Check both multi-value checkboxes", async () => {
		const selector = '#test-terms-service';
		const selector2 = '#test-terms-service-more';
		await page.type(selector, " ");
		await page.type(selector2, " ");
		await page.waitForSelector(selector + '['+cfg.fieldIsValid+']');
		await page.waitForSelector(selector2 + '['+cfg.fieldIsValid+']');
	});

	test("Form is valid 2", async () => {
		await page.waitForSelector(formSelector + '['+cfg.formIsValid+']');
	});

	test("Remove value in required field (random textarea), field invalid", async () => {
		const selector = 'textarea[name=random-textarea]';
		const expectMessage = "This field can't be empty";
		await page.focus(selector);
		await page.evaluate(selector => window.clearField(selector), selector);
		await page.evaluate(selector => window.unFocus(selector), selector);
		await page.waitForFunction(([selector, attr, message]) => {
			return window.getContainer(selector, attr).innerText === message;
		}, {}, [selector, cfg.invMessage, expectMessage]);
	});

	test("Form is invalid 2", async () => {
		const validAttr = await page.evaluate(([selector, attr]) => window.getAttr(selector, attr), ([formSelector, cfg.formIsValid]));
		expect(validAttr).toBeFalsy();
	});

	test("Submit form in invalid state, check for formInvalidCallback", async () => {
		const selector = 'button[type=submit]';
		const expectMessage = "formInvalidCallback callback fired";
		await page.evaluate(s => { document.querySelector(s).disabled=false; }, selector);
		await page.evaluate(s => { document.querySelector(s).click(); }, selector);
		await page.waitForFunction(m => {
			return window.formInvalidCallback().message === m;
		}, {}, expectMessage);
	});

	test("Invalid form message", async () => {
		const errSelector = '.' + cfg.formError.className;
		const expectMessage = "Please correct the errors in red";
		const errText = await page.evaluate(s => document.querySelector(s).innerText, errSelector);
		expect(errText).toBe(expectMessage);
	});

	test("Button is disabled", async () => {
		const selector = 'button[type=submit]';
		await page.evaluate(s => { document.querySelector(s).disabled=true; }, selector);
		const isDisabled = await page.evaluate(s => window.isDisabled(s), selector);
		expect(isDisabled).toBeTruthy();
	});

	test("Add back value in required field formValidCallback fires", async () => {
		const selector = 'textarea[name=random-textarea]';
		const expectMessage = "formValidCallback callback fired";
		await page.focus(selector);
		await page.type(selector, "yardy yard yard yarr");
		await page.evaluate(selector => window.unFocus(selector), selector);
		await page.waitForFunction(m => {
			return window.formValidCallback().message === m;
		}, {}, expectMessage);
	});

	test("Form is valid 3", async () => {
		await page.waitForSelector(formSelector + '['+cfg.formIsValid+']');
	});

	test("Value removed from optional field, UI on field resets", async () => {
		const selector = 'input[name=random]';
		await page.focus(selector);
		await page.evaluate(selector => window.clearField(selector), selector);
		await page.evaluate(selector => window.unFocus(selector), selector);
		const waitLength = await page.evaluate(s => window.getWait(s), selector);
		await page.waitFor(waitLength); // bypass any debounce wait
		const hasClasses = await page.evaluate(([selector, attr, str]) => {
			return window.filterClassListFor(selector, attr, str);
		}, ([selector, cfg.valTarget, 'form-field-']));
		const hasMessage = await page.evaluate(([selector, attr]) => window.getAttr(selector, attr).innerText, ([formSelector, cfg.formIsValid]));
		expect(hasClasses).toEqual(0);
		expect(hasMessage).toBeFalsy();
	});

	test("Form is valid 4", async () => {
		await page.waitForSelector(formSelector + '['+cfg.formIsValid+']');
	});

	test("Submit button NOT disabled", async () => {
		const isDisabled = await page.evaluate(s => window.isDisabled(s), 'button[type=submit]');
		expect(isDisabled).toBeFalsy();
	});

	test("Submit valid form, check for formValidCallback", async () => {
		const selector = 'button[type=submit]';
		const expectMessage = "formValidCallback callback fired";
		await page.evaluate(s => { document.querySelector(s).disabled=false; }, selector);
		await page.evaluate(s => { document.querySelector(s).click(); }, selector);
		await page.waitForFunction(m => {
			return window.formValidCallback().message === m;
		}, {}, expectMessage);
	});

	test("Form is valid 5", async () => {
		await page.waitForSelector(formSelector + '['+cfg.formIsValid+']');
	});

	test("Deliberate pause", async () => {
		await page.waitFor(2000);
		expect(true).toBe(true);
	});
});
