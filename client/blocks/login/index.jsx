/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import config from 'config';
import FormsButton from 'components/forms/form-button';
import Card from 'components/card';
import FormPasswordInput from 'components/forms/form-password-input';
import FormTextInput from 'components/forms/form-text-input';
import FormCheckbox from 'components/forms/form-checkbox';
import { loginUser } from 'state/login/actions';
import Notice from 'components/notice';
import { createFormAndSubmit } from 'lib/form';
import { recordTracksEvent } from 'state/analytics/actions';

export class Login extends Component {
	static propTypes = {
		loginUser: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
		loginError: PropTypes.string,
		redirectLocation: PropTypes.string,
		title: PropTypes.string,
	};

	static defaultProps = {
		title: '',
	};

	constructor() {
		super();
		this.state = {
			usernameOrEmail: '',
			password: '',
			rememberme: false,
			submitting: false,
			errorMessage: '',
		};
		this.onChangeField = this.onChangeField.bind( this );
		this.onSubmitForm = this.onSubmitForm.bind( this );
	}

	onChangeField( event ) {
		this.props.recordTracksEvent( 'calypso_loginblock_rememberme_change', { new_value: event.target.value } );
		this.setState( {
			[ event.target.name ]: event.target.value
		} );
	}

	onSubmitForm( event ) {
		event.preventDefault();
		this.setState( {
			submitting: true
		} );

		this.props.recordTracksEvent( 'calypso_loginblock_login_submit' );

		this.props.loginUser( this.state.usernameOrEmail, this.state.password ).then( () => {
			this.props.recordTracksEvent( 'calypso_loginblock_login_success' );
			this.setState( {
				errorMessage: ''
			} );
			createFormAndSubmit( config( 'login_url' ), {
				log: this.state.usernameOrEmail,
				pwd: this.state.password,
				redirect_to: this.props.redirectLocation || window.location.origin,
				rememberme: this.state.rememberme ? 1 : 0,
			} );
		} ).catch( errorMessage => {
			this.props.recordTracksEvent( 'calypso_loginblock_login_failure', {
				error_message: errorMessage
			} );

			this.setState( {
				submitting: false,
				errorMessage
			} );
		} );
	}

	renderNotices() {
		if ( this.state.errorMessage ) {
			return (
				<Notice status="is-error" text={ this.state.errorMessage } />
			);
		}
	}

	render() {
		const isDisabled = {};
		if ( this.state.submitting ) {
			isDisabled.disabled = true;
		}

		return (
			<div className="login">

				{ this.renderNotices() }

				<div className="login__form-header">
					<div className="login__form-header-title">
						{ this.props.title }
					</div>
				</div>

				<form onSubmit={ this.onSubmitForm }>
					<Card className="login__form">
						<div className="login__form-userdata">
							<label className="login__form-userdata-username">
								{ this.props.translate( 'Username or Email Address' ) }
								<FormTextInput
									className="login__form-userdata-username-input"
									onChange={ this.onChangeField }
									name="usernameOrEmail"
									value={ this.state.usernameOrEmail }
									{ ...isDisabled } />
							</label>
							<label className="login__form-userdata-username">
								{ this.props.translate( 'Password' ) }
								<FormPasswordInput
									className="login__form-userdata-username-password"
									onChange={ this.onChangeField }
									name="password"
									value={ this.state.password }
									{ ...isDisabled } />
							</label>
						</div>
						<div className="login__form-remember-me">
							<label>
								<FormCheckbox
									name="rememberme"
									checked={ this.state.rememberme }
									onChange={ this.onChangeField }
									{ ...isDisabled } />
								{ this.props.translate( 'Stay logged in' ) }
							</label>
						</div>
						<div className="login__form-action">
							<FormsButton primary { ...isDisabled }>
								{ this.props.translate( 'Log in' ) }
							</FormsButton>
						</div>
					</Card>
				</form>
			</div>
		);
	}
}

export default connect(
	null,
	{
		loginUser,
		recordTracksEvent
	}
)( localize( Login ) );
