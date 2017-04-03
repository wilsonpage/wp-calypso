/**
 * External Dependencies
 */
import ReactDom from 'react-dom';
import React from 'react';
import page from 'page';
import i18n from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import { abtest } from 'lib/abtest';
import route from 'lib/route';
import feedStreamFactory from 'lib/feed-stream-store';
import { renderWithReduxStore } from 'lib/react-helpers';
import AsyncLoad from 'components/async-load';
import Discussions from './main';

const analyticsPageTitle = 'Discussions';

module.exports = {
	discussions: context => {
		renderWithReduxStore(
			React.createElement(Discussions ),
			'primary',
			context.store
		);
	}
};
