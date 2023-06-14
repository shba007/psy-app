export default {
	schizoid: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [10, 27, 46, 92, 105, 148, 165] },
			{ condition: true, weight: 1, indexes: [4, 38, 48, 101, 142, 156, 167] },
			{ condition: false, weight: 1, indexes: [32, 57] },
		],
	}, avoidant: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [18, 40, 69, 84, 99, 127, 141, 174] },
			{ condition: true, weight: 1, indexes: [47, 48, 146, 148, 151, 158] },
			{ condition: false, weight: 1, indexes: [57, 80] },
		],
	}, depressive: {
		type: 'single-weighted',
		count: 0,
		// NOTE: 112 or , 145 or 135, 151 or 169, or 154
		items: [
			{ condition: true, weight: 2, indexes: [20, 25, 47, 123, 133, 145, 169] },
			{ condition: true, weight: 1, indexes: [24, 43, 83, 86, 142, 148, 154] },
		],
	}, dependent: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [16, 35, 45, 73, 94, 108, 135, 169] },
			{ condition: true, weight: 1, indexes: [47, 56, 84, 120, 133, 141, 151] },
			{ condition: false, weight: 1, indexes: [82] },
		],
	}, histrionic: {
		type: 'single-weighted',
		count: 0,
		items: [
			/* { condition: true, weight: 2, indexes: [5, 26, 31, 67, 85, 93, 144, 159] },
			{ condition: true, weight: 1, indexes: [21, 38, 57, 80, 88, 116] },
			{ condition: false, weight: 1, indexes: [35, 40, 47, 69, 84, 86, 94, 99, 141, 169] }, */
			{ condition: true, weight: 2, indexes: [12, 21, 32, 51, 57, 80, 88] },
			{ condition: false, weight: 1, indexes: [10, 24, 27, 48, 69, 92, 99, 123, 127, 174] },
		],
	}, narcissistic: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [5, 26, 31, 67, 85, 93, 144, 159] },
			{ condition: true, weight: 1, indexes: [21, 38, 57, 80, 88, 116] },
			{ condition: false, weight: 1, indexes: [35, 40, 47, 69, 84, 86, 94, 99, 141, 169] },
		],
	}, antisocial: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [17, 38, 53, 101, 113, 139, 166] },
			{ condition: true, weight: 1, indexes: [7, 13, 14, 21, 41, 52, 93, 122, 136] },
			{ condition: false, weight: 1, indexes: [172] },
		],
	}, sadistic: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [9, 14, 28, 64, 87, 95, 116] },
			{ condition: true, weight: 1, indexes: [7, 13, 17, 33, 36, 39, 41, 49, 53, 79, 93, 96, 166] },
		],
	}, compulsive: {
		type: 'single-weighted',
		count: 0,
		// NOTE: 22 or 21
		items: [
			{ condition: true, weight: 2, indexes: [2, 29, 59, 82, 97, 114, 137, 172] },
			{ condition: false, weight: 1, indexes: [7, 14, 21, 41, 53, 72, 101, 139, 166] },
		],
	}, negativistic: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [7, 15, 22, 36, 50, 60, 79, 115, 126] },
			{ condition: true, weight: 1, indexes: [6, 42, 83, 98, 122, 133, 166] },
		],
	}, masochistic: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [19, 43, 70, 90, 104, 122, 161] },
			{ condition: true, weight: 1, indexes: [18, 24, 25, 35, 40, 98, 148, 169] },
		],
	}, schizotypal: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [8, 48, 71, 76, 117, 138, 156, 158, 162] },
			{ condition: true, weight: 1, indexes: [69, 99, 102, 134, 141, 148, 151] },
		],
	}, borderline: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [30, 41, 72, 83, 98, 120, 134, 142, 154] },
			{ condition: true, weight: 1, indexes: [7, 22, 122, 135, 161, 166, 171] },
		],
	}, paranoid: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [6, 33, 42, 49, 89, 103, 146, 167, 175] },
			{ condition: true, weight: 1, indexes: [8, 48, 60, 63, 115, 138, 158, 159] },
		],
	}, anxiety: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [58, 75, 124, 147, 164, 170] },
			{ condition: true, weight: 1, indexes: [40, 61, 76, 108, 109, 135, 145, 149] },
		],
	}, somatoform: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [4, 11, 37, 55, 74] },
			{ condition: true, weight: 1, indexes: [1, 75, 107, 111, 130, 145, 148] },
		],
	}, bipolar: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [3, 54, 96, 106, 125] },
			{ condition: true, weight: 1, indexes: [22, 41, 51, 83, 117, 134, 166, 170] },
		],
	}, dysthymia: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [24, 56, 62, 86, 111, 130] },
			{ condition: true, weight: 1, indexes: [15, 25, 55, 83, 104, 141, 142, 148] },
		],
	}, 'alcohol-dependence': {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [52, 77, 100, 131, 152] },
			{ condition: true, weight: 1, indexes: [14, 41, 64, 93, 101, 113, 122, 139, 166] },
			{ condition: false, weight: 1, indexes: [23] },
		],
	}, 'drug-dependence': {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [13, 39, 66, 91, 118, 136] },
			{ condition: true, weight: 1, indexes: [7, 21, 38, 41, 53, 101, 113, 139] },
		],
	}, 'post-traumatic-stress-disorder': {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [109, 129, 149, 160, 173] },
			{ condition: true, weight: 1, indexes: [62, 76, 83, 123, 133, 142, 147, 148, 151, 154, 164] },
		],
	}, 'thought-disorder': {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [34, 61, 68, 78, 102, 168] },
			{ condition: true, weight: 1, indexes: [22, 56, 72, 76, 83, 117, 134, 142, 148, 151, 162] },
		],
	}, 'major-depression': {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [1, 44, 107, 128, 150, 171] },
			{ condition: true, weight: 1, indexes: [4, 34, 55, 74, 104, 111, 130, 142, 148, 149, 154] },
		],
	}, 'delusional-disorder': {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 2, indexes: [63, 119, 140, 153] },
			{ condition: true, weight: 1, indexes: [5, 38, 49, 67, 89, 103, 138, 159, 175] },
		],
	}, desirability: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 1, indexes: [32, 51, 57, 59, 80, 82, 88, 97, 137, 172] },
			{ condition: false, weight: 1, indexes: [20, 35, 40, 69, 104, 112, 123, 141, 142, 148, 151] },
		],
	}, debasement: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 1, indexes: [1, 4, 8, 15, 22, 24, 30, 34, 36, 37, 44, 55, 56, 58, 62, 63, 70, 74, 75, 76, 83, 84, 86, 99, 111, 123, 128, 133, 134, 142, 145, 150, 171] },
		],
	}, validity: {
		type: 'single-weighted',
		count: 0,
		items: [
			{ condition: true, weight: 1, indexes: [65, 110, 157] },
		],
	},
}