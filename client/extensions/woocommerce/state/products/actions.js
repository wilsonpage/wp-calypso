/**
 * Internal dependencies
 */
import { WOOCOMMERCE_EDIT_PRODUCT, WOOCOMMERCE_ADD_VARIATION } from '../action-types';

export function editProduct( id, key, value ) {
	return {
		type: WOOCOMMERCE_EDIT_PRODUCT,
		payload: { id, key, value },
	};
}

export function addVariation( id, variation ) {
	return {
		type: WOOCOMMERCE_ADD_VARIATION,
		payload: { id, variation },
	};
}

export function generateVariations( id ) {
	return ( dispatch, getState ) => {
		const possibleValues = [];
		const indexesToLabels = [];
		const possibleVariations = [];
		const existingVariations = [];

		// @Todo Load proper product when editing instead of creating.
		const product = getState().extensions.woocommerce.products.edits.add;

		product.variationTypes.map( function( variationType ) {
			if ( variationType.type.length > 0 && variationType.values.length > 0 ) {
				possibleValues.push( variationType.values );
				indexesToLabels.push( variationType.type );
			}
		} );

		if ( possibleValues.length > 1 ) {
			// http://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
			const f = ( a, b ) => [].concat( ...a.map( c => b.map( d => [].concat( c, d ) ) ) );
			const cartesian = ( a, b, ...c ) => b ? cartesian( f( a, b ), ...c ) : a;
			cartesian( ...possibleValues ).map( function( entry ) {
				possibleVariations.push( entry.join( ' - ' ) );
			} );
		} else {
			possibleValues[ 0 ].map( function( value ) {
				possibleVariations.push( value );
			} );
		}

		product.variations.map( function( variation ) {
			const attributes = Array();
			variation.attributes.map( function( attribute ) {
				attributes.push( attribute.option );
			} );
			existingVariations.push( attributes.join( ' - ' ) );
		} );

		const newVariations = possibleVariations.filter( x => existingVariations.indexOf( x ) === -1 );
		newVariations.map( function( newVariationName ) {
			const attributes = Array();
			newVariationName.split( ' - ' ).map( function( option, index ) {
				const attribute = Array( 3 );
				attribute.id = 0; // default for product level attributes in WC
				attribute.name = indexesToLabels[ index ];
				attribute.option = option;
				attributes.push( attribute );
			} );

			dispatch( addVariation( id, {
				name: newVariationName,
				attributes,
			} ) );
		} );
	};
}
