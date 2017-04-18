/**
 * External dependencies
 */
import { get } from 'lodash';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import {
	ANALYTICS_SUPER_PROPS_UPDATE,
	SELECTED_SITE_SET,
	SITE_RECEIVE,
	SITES_RECEIVE,
	SITES_UPDATE,
	SITES_ONCE_CHANGED,
} from 'state/action-types';
import analytics from 'lib/analytics';
import cartStore from 'lib/cart/store';
import { getSelectedSite, getSelectedSiteId } from 'state/ui/selectors';
import { getCurrentUser } from 'state/current-user/selectors';

const debug = debugFactory( 'calypso:state:middleware' );

/**
 * Sets the selectedSite and siteCount for lib/analytics. This is used to
 * populate extra fields on tracks analytics calls.
 *
 * @param {function} dispatch - redux dispatch function
 * @param {object}   action   - the dispatched action
 * @param {function} getState - redux getState function
 */
const updateSelectedSiteForAnalytics = ( dispatch, action, getState ) => {
	const state = getState();
	const selectedSite = getSelectedSite( state );
	const user = getCurrentUser( state );
	const siteCount = get( user, 'site_count', 0 );
	analytics.setSelectedSite( selectedSite );
	analytics.setSiteCount( siteCount );
};

/**
 * Sets the selectedSiteId for lib/cart/store
 *
 * @param {function} dispatch - redux dispatch function
 * @param {object}   action   - the dispatched action
 * @param {function} getState - redux getState function
 */
const updateSelectedSiteForCart = ( dispatch, action, getState ) => {
	const state = getState();
	const selectedSiteId = getSelectedSiteId( state );
	cartStore.setSelectedSiteId( selectedSiteId );
};

const handler = ( dispatch, action, getState ) => {
	switch ( action.type ) {
		case ANALYTICS_SUPER_PROPS_UPDATE:
			return updateSelectedSiteForAnalytics( dispatch, action, getState );

		case SELECTED_SITE_SET:
		case SITE_RECEIVE:
		case SITES_RECEIVE:
		case SITES_UPDATE:
			// Wait a tick for the reducer to update the state tree
			setTimeout( () => {
				updateSelectedSiteForCart( dispatch, action, getState );
			}, 0 );
			return;
	}
};

/*
 * Here be dragons.
 */
let _queue = [];
const receiveSitesChangeListener = ( dispatch, { listener } ) => {
	debug( 'receiveSitesChangeListener' );
	_queue.push( listener );
};

const fireChangeListeners = () => {
	debug( 'firing', _queue.length, 'emitters' );
	_queue.forEach( ( listener ) => listener() );
	_queue = [];
};

export const handlers = {
	[ ANALYTICS_SUPER_PROPS_UPDATE ]: updateSelectedSiteForAnalytics,
	[ SITES_ONCE_CHANGED ]: receiveSitesChangeListener,
	[ SITES_RECEIVE ]: fireChangeListeners,
};

export const libraryMiddleware = ( { dispatch, getState } ) => ( next ) => ( action ) => {
	handler( dispatch, action, getState );

	return next( action );
};

export default libraryMiddleware;
