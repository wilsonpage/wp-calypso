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
import FoldableCard from 'components/foldable-card';
import ProductVariationTypesForm from './product-variation-types-form';
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

		this.state = {
			isVariation: props.product && 'variable' === props.product.type ? true : false,
		};

		this.handleToggle = this.handleToggle.bind( this );
		this.setName = this.setName.bind( this );
		this.setDescription = this.setDescription.bind( this );
		this.toggleFeatured = this.toggleFeatured.bind( this );
	}

	handleToggle() {
		this.setState( ( prevState ) => ( {
			isVariation: ! prevState.isVariation,
		} ) );
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

		const variationToggleDescription = i18n.translate(
			'%(productName)s has variations, for example size and color.', {
				args: {
					productName: product && product.name || i18n.translate( 'This product' )
				}
			}
		);

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

				<FoldableCard
					icon=""
					expanded={ true }
					className="product-variations"
					header={ ( <FormToggle onChange={ this.handleToggle } checked={ this.state.isVariation }>
					{variationToggleDescription}
					</FormToggle>
					) }
				>
					{ this.state.isVariation && (
						<ProductVariationTypesForm />
					) }
				</FoldableCard>
			</div>
		);
	}

}
