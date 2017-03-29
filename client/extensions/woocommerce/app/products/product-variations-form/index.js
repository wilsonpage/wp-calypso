/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';

export default class ProductVariationsForm extends Component {

	static propTypes = {
		product: PropTypes.object.isRequired,
		editProduct: PropTypes.func.isRequired,
	};

	render() {
		return (
			<div>Table goes here</div>
		);
	}

}
