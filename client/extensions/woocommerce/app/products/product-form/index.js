/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import i18n from 'i18n-calypso';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import FoldableCard from 'components/foldable-card';
import ProductVariationTypesForm from '../product-variation-types-form';
import ProductVariationsForm from '../product-variations-form';
import FormToggle from 'components/forms/form-toggle';
import { editProduct } from '../../../state/products/actions';
import Button from 'components/button';

class ProductForm extends Component {

	static propTypes = {
		product: PropTypes.object.isRequired,
		editProduct: PropTypes.func.isRequired,
	};

	constructor( props ) {
		super( props );

		this.handleVariationToggle = this.handleVariationToggle.bind( this );
	}

	handleVariationToggle() {
		let newType;
		if ( this.props.product.type && 'variable' === this.props.product.type ) {
			newType = 'simple';
		} else {
			newType = 'variable';
		}
		this.props.editProduct( null, 'type', newType );
	}

	render() {
		const { product } = this.props;
		const variationToggleDescription = i18n.translate(
			'%(productName)s has variations, for example size and color.', {
				args: {
					productName: product && product.name || i18n.translate( 'This product' )
				}
			}
		);
		let updateVariationsText = i18n.translate( 'Update Variations' );
		if ( ! product.variations ) {
			updateVariationsText = i18n.translate( 'Create Variations' );
		}

		return (
			<div class="product-form">
			<FoldableCard
				icon=""
				expanded={ true }
				className="product-form__product-variations"
				header={ ( <FormToggle onChange={ this.handleVariationToggle } checked={ 'variable' === product.type }>
				{variationToggleDescription}
				</FormToggle>
				) }
			>
				{ 'variable' === product.type && (
					<div>
						<ProductVariationTypesForm
							product={ product }
							editProduct={ this.props.editProduct }
						/>

						<Button onClick={ this.updateVariations }>{ updateVariationsText }</Button>

						<ProductVariationsForm
							product={ product }
							editProduct={ this.props.editProduct }
						/>
					</div>
				) }
			</FoldableCard>
			</div>
		);
	}

}

function mapStateToProps( state ) {
	const { products } = state.woocommerce;
	return {
		product: products.edits.add, // @TODO Should load in proper product when editing.
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			editProduct,
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( ProductForm );
