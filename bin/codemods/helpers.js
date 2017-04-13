const IGNORABLE_STRINGS = [
	'SKIP',
	'NOC',
	'files to free worker',
];

function isIgnorable( buffer ) {
	return IGNORABLE_STRINGS.some( s => buffer.includes( s ) );
}

function bindEvents( jscodeshiftProcess ) {
	const processedFiles = [];
	jscodeshiftProcess.stdout.on( 'data', ( data ) => {
		if ( isIgnorable( data ) ) {
			return;
		} else if ( data.includes( 'OKK' ) ) {
			processedFiles.push( ...data.toString().split( '\n' ).filter( s => s.trim().length > 0 ).map( s => s.replace( ' OKK ', '' ) ) );
			return;
		}

		process.stdout.write( data );
	} );

	jscodeshiftProcess.stderr.on( 'data', ( data ) => {
		process.stderr.write( data );
	} );

	jscodeshiftProcess.on( 'close', () => {
		if ( process.send ) {
			process.send( { processedFiles } );
		}
	} );
}

module.exports = {
	bindEvents,
};
