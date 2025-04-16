module.exports = {
	root: true,
	parserOptions: {
		project: ['./tsconfig.json'],
		extraFileExtensions: ['.json'],
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/nodes',
	],
	ignorePatterns: ['node_modules/', 'dist/'],
	rules: {
		'n8n-nodes-base/node-param-default-wrong-for-multi-options': 'off',
		'n8n-nodes-base/node-param-description-comma-separated-hyphen': 'off',
		'n8n-nodes-base/node-param-options-type-unsorted-items': 'off',
		'n8n-nodes-base/node-param-resource-with-plural-option': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'n8n-nodes-base/node-execute-block-wrong-error-thrown': 'error',
	},
}; 