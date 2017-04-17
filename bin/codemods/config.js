const jscodeshiftArgs = [
	'--extensions=js,jsx',
	'--verbose=2',
];

const recastArgs = [
	'--useTabs=true',
	'--arrayBracketSpacing=true',
];

const recastOptions = {
	arrayBracketSpacing: true,
	objectCurlySpacing: true,
	quote: 'single',
	useTabs: true,
};

module.exports = {
	jscodeshiftArgs,
	recastArgs,
	recastOptions,
};
