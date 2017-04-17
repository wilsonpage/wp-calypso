/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import FormLabel from 'components/forms/form-label';
import FormTextArea from 'components/forms/form-textarea';
import FormTextInput from 'components/forms/form-text-input';
import ProductFormVariationCard from './product-form-variation-card';
import FormToggle from 'components/forms/form-toggle';

export default class ProductForm extends Component {

	static propTypes = {
		product: PropTypes.shape( {
			id: PropTypes.isRequired,
			type: PropTypes.string.isRequired,
			name: PropTypes.string,
		} ),
		editProduct: PropTypes.func.isRequired,
		editProductAttribute: PropTypes.func.isRequired,
	};

	constructor( props ) {
		super( props );

		this.setName = this.setName.bind( this );
		this.setDescription = this.setDescription.bind( this );
		this.toggleFeatured = this.toggleFeatured.bind( this );
	}

	setName( e ) {
		const { product, editProduct } = this.props;
		editProduct( product, { name: e.target.value } );
	}

	setDescription( e ) {
		const { product, editProduct } = this.props;
		editProduct( product, { description: e.target.value } );
	}

	toggleFeatured() {
		const { product, editProduct } = this.props;
		editProduct( product, { featured: ! product.featured } );
	}

	render() {
		const { product } = this.props;
		const __ = i18n.translate;

		return (
			<div>
				<Card
					className="products__product-form-details"
				>
					<div>
						<FormLabel>
							{ __( 'Featured' ) }
							<FormToggle
								onChange={ this.toggleFeatured }
								checked={ product.featured }
							/>
						</FormLabel>
					</div>
					<div>
						<FormLabel>
							<div>{ __( 'Product images' ) }</div>
							<div>[ Big Image Box ]</div>
							<div>{ __( 'For best results, upload photos larger than 1000x1000px' ) }</div>
						</FormLabel>
					</div>
					<div>
						<FormLabel>
							<span>{ __( 'Product name' ) }</span>
							<FormTextInput value={ product.name || '' } onChange={ this.setName } />
						</FormLabel>
						<FormLabel>
							<span>{ __( 'SKU' ) }: { product.sku || __( '-' ) } </span>
						</FormLabel>
						<FormLabel>
							<span>{ __( 'Description' ) }</span>
							<FormTextArea value={ product.description || '' } onChange={ this.setDescription } />
						</FormLabel>
					</div>
				</Card>

				<ProductFormVariationCard
					product={ product }
					editProduct={ this.props.editProduct }
					editProductAttribute={ this.props.editProductAttribute }
				/>
			</div>
		);
	}

}
