/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { WOOCOMMERCE_EDIT_PRODUCT, WOOCOMMERCE_ADD_VARIATION } from '../action-types';

export const initialState = {
	add: {
		id: null,
		variationTypes: [ {
			type: '',
			values: [],
		} ],
		variations: [],
	},
};

export function edits( state = initialState, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_EDIT_PRODUCT:
			return editProduct( state, action );
		case WOOCOMMERCE_ADD_VARIATION:
			return addVariation( state, action );
		default:
			return state;
	}
}

export function editProduct( state, action ) {
	const { id, key, value } = action.payload;
	const add = state.add || {};

	if ( ! id ) {
		const newAdd = Object.assign( {}, add, { [ key ]: value } );
		return Object.assign( {}, state, { add: newAdd } );
	}

	/// @Todo Logic for existing products (in addition to new product above).
	return state;
}

export function addVariation( state, action ) {
	const { id, variation } = action.payload;
	const add = state.add || {};

	if ( ! id ) {
		const newVariations = [ ...add.variations ];
		newVariations.push( variation );
		const newAdd = Object.assign( {}, add, { [ 'variations' ]: newVariations } );
		return Object.assign( {}, state, { add: newAdd } );
	}

	// @Todo Logic for editing an existing entry.
	return state;
}

export default combineReducers( {
	edits,
} );
