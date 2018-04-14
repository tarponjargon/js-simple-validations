import Util from '../utilities';
import cfg from '../config';

let util = new Util();

describe('Util suite', function() {
    test('Should reurn a unique array', () => {
		let dupeArr = ['val1','val2','val3','val1'];
		let uniqArr = util.uniqueArray(dupeArr);
		let resultArr = uniqArr.filter(i => i === 'val1');
        expect(resultArr.length).toEqual(1);
    });

	test('Should return array with no empty elements, or elements with leading/trailing whitespace', () => {
		let testArr = ['val1', '   ', null, '  val2 '];
		let resultArr = util.cleanArray(testArr);
		expect(resultArr[0]).toBe('val1');
		expect(resultArr[1]).toBe('val2');
	});

	test('Should return a digit->word conversion for numbers < 10', () => {
		for (var i = 0; i < 11; i++) {
			let num = util.digitWord(i);
			if (i < 10) {
				expect(typeof num).toBe('string');
			} else {
				expect(typeof num).toBe('number');
			}
		}
	});

	test('Should return a string with encoded script tag', () => {
		let badString = '<script>alert("hello")</script>';
		let safeString = util.safeString(badString);
		expect(safeString).toBe('&lt;script&gt;alert(&quot;hello&quot;)&lt;/script&gt;');
	});

	test('Should NOT return a safeString (input wrapper)', () => {
		let badString = '<script>alert("hello")</script>';
		cfg.safeStringInput = false;
		let safeString = util.safeStringInput(badString);
		expect(safeString).toBe('<script>alert(\"hello\")</script>');
		cfg.safeStringInput = true;
	});


}); // end Util suite
