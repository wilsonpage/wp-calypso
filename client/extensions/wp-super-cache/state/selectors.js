/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Returns true if we are requesting settings for the specified site ID, false otherwise.
 *
 * @param  {Object}  reduxState Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Boolean} Whether settings are being requested
 */
export function isRequestingSettings( reduxState, siteId ) {
	const state = reduxState.extensions.wpSuperCache;

	return state ? get( state.requesting, [ siteId ], false ) : false;
}

/**
 * Returns true if we are saving settings for the specified site ID, false otherwise.
 *
 * @param  {Object}  reduxState Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Boolean} Whether settings are being saved
 */
export function isSavingSettings( reduxState, siteId ) {
	const state = reduxState.extensions.wpSuperCache;

	return state ? get( state.saveStatus, [ siteId, 'saving' ], false ) : false;
}

/**
 * Returns true if the settings save request was successful.
 *
 * @param  {Object}  reduxState Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Boolean} Whether settings were saved successfully
 */
export function isSettingsSaveSuccessful( reduxState, siteId ) {
	return getSettingsSaveStatus( reduxState, siteId ) === 'success';
}

/**
 * Returns the settings for the specified site ID.
 *
 * @param  {Object} reduxState Global state tree
 * @param  {Number} siteId Site ID
 * @return {Object} Settings
 */
export function getSettings( reduxState, siteId ) {
	const state = reduxState.extensions.wpSuperCache;

	return state ? get( state.items, [ siteId ], null ) : null;
}

/**
 * Returns the status of the last settings save request.
 *
 * @param  {Object}  reduxState Global state tree
 * @param  {Number}  siteId Site ID
 * @return {String}  Save request status (pending, success or error)
 */
export function getSettingsSaveStatus( reduxState, siteId ) {
	const state = reduxState.extensions.wpSuperCache;

	return state ? get( state.saveStatus, [ siteId, 'status' ], null ) : null;
}

/**
 * Returns the error returned by the last settings save request.
 *
 * @param  {Object}  reduxState Global state tree
 * @param  {Number}  siteId Site ID
 * @return {String}  Request error
 */
export function getSettingsSaveError( reduxState, siteId ) {
	const state = reduxState.extensions.wpSuperCache;

	return state ? get( state.saveStatus, [ siteId, 'error' ], false ) : false;
}
