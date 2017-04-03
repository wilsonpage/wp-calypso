/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import controller from './controller';
import config from 'config';

export default () => {
	page( '/discussions', controller.discussions);
};
