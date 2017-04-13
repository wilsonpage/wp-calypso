/**
 * External dependencies
 */
import React from 'react';
import { noop } from 'lodash';
import { localize } from 'i18n-calypso';

class FollowingManageSortControls extends React.Component {

	static propTypes = {
		onSelectChange: React.PropTypes.func,
		sortOrder: React.PropTypes.oneOf( [ 'date-followed', 'alpha' ] ),
	}

	static defaultProps = {
		onSelectChange: noop,
	}

	handleSelectChange = ( event ) => {
		this.props.onSelectChange( event.target.value );
	}

	render() {
		const sortOrder = this.props.sortOrder;

		return (
			<div className="following-manage__sort-controls">
				<label htmlFor="sort-control-select">{ this.props.translate( 'Sort by' ) }</label>
				<select onChange={ this.handleSelectChange } value={ sortOrder }>
					<option value="date-followed">{ this.props.translate( 'By Date' ) }</option>
					<option value="alpha">{ this.props.translate( 'By Name' ) }</option>
				</select>
			</div>
		);
	}
}

export default localize( FollowingManageSortControls );
