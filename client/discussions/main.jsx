/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';
import page from 'page';
import { initial, flatMap, trim } from 'lodash';

/**
 * Internal dependencies
 */
import Stream from 'reader/stream';
import CompactCard from 'components/card/compact';
import SearchInput from 'components/search';
import { recordTrack } from 'reader/stats';
import Suggestion from 'reader/search-stream/suggestion';
import SuggestionProvider from 'reader/search-stream/suggestion-provider';

import SectionNav from 'components/section-nav';
import NavTabs from 'components/section-nav/tabs';
import NavSegmented from 'components/section-nav/segmented';
import NavItem from 'components/section-nav/item';
import Search from 'components/search';

const Discussions = props => {
	return (
		<div>
			<SectionNav selectedText="Pending">
				<NavTabs label="Status">
					<NavItem count={8}>Pending</NavItem>
					<NavItem>Approved</NavItem>
					<NavItem>Spam</NavItem>
					<NavItem count={4}>Trash</NavItem>
					<NavItem>All</NavItem>
				</NavTabs>
				<NavSegmented label="Order">
					<NavItem>Newest</NavItem>
					<NavItem>Oldest</NavItem>
				</NavSegmented>
				<NavSegmented label="Bulk">
					<NavItem>Edit All</NavItem>
				</NavSegmented>
				<Search
					pinned
					fitsContainer
					placeholder={ 'Search discussions...' }
				/>
			</SectionNav>
		</div>
	);
}

export default Discussions;
