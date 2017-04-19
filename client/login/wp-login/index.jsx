/**
 * External dependencies
 */
import React from 'react';
import { compact } from 'lodash';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import {
	CHECK_YOUR_EMAIL_PAGE,
	INTERSTITIAL_PAGE,
	LINK_EXPIRED_PAGE,
	REQUEST_FORM,
} from 'state/login/magic-login/constants';
import config, { isEnabled } from 'config';
import EmailedLoginLinkSuccessfully from '../magic-login/emailed-login-link-successfully';
import EmailedLoginLinkExpired from '../magic-login/emailed-login-link-expired';
import {
	getMagicLoginEmailAddressFormInput,
	getMagicLoginCurrentView,
} from 'state/selectors';
import { getCurrentQueryArguments } from 'state/ui/selectors';
import Gridicon from 'gridicons';
import HandleEmailedLinkForm from '../magic-login/handle-emailed-link-form';
import {
	hideMagicLoginRequestForm,
	showMagicLoginInterstitialPage,
	showMagicLoginRequestForm,
} from 'state/login/magic-login/actions';
import Main from 'components/main';
import LoginBlock from 'blocks/login';
import RequestLoginEmailForm from '../magic-login/request-login-email-form';
import { recordTracksEvent, recordPageView } from 'state/analytics/actions';

class Login extends React.Component {
	onClickEnterPasswordInstead = event => {
		event.preventDefault();
		this.props.recordTracksEvent( 'calypso_login_enterpasswordinstead_click' );
		this.props.hideMagicLoginRequestForm();
	};

	onMagicLoginRequestClick = event => {
		event.preventDefault();
		this.props.recordTracksEvent( 'calypso_login_magicloginrequest_click' );
		this.props.showMagicLoginRequestForm();
	};

	magicLoginMainContent() {
		const {
			magicLoginView,
			magicLoginEmailAddress,
		} = this.props;

		switch ( magicLoginView ) {
			case LINK_EXPIRED_PAGE:
				this.props.recordTracksEvent( 'calypso_login_magiclink_expiredlink_view' );
				return <EmailedLoginLinkExpired />;
			case CHECK_YOUR_EMAIL_PAGE:
				this.props.recordTracksEvent( 'calypso_login_magiclink_linksent_view' );
				return <EmailedLoginLinkSuccessfully emailAddress={ magicLoginEmailAddress } />;
			case INTERSTITIAL_PAGE:
				this.props.recordTracksEvent( 'calypso_login_magiclink_interstitial_view' );
				return <HandleEmailedLinkForm />;
		}
	}

	componentWillMount() {
		const {
			magicLoginEnabled,
			queryArguments,
		} = this.props;

		if ( magicLoginEnabled && queryArguments && queryArguments.action === 'handleLoginEmail' ) {
			this.props.showMagicLoginInterstitialPage();
		}
	}

	componentDidMount() {
		this.props.recordPageView( document.location.pathname, document.title );
	}

	goBack = event => {
		event.preventDefault();

		this.props.recordTracksEvent( 'calypso_login_goback_click' );

		if ( typeof window !== 'undefined' ) {
			window.history.back();
		}
	};

	footerLinks() {
		const {
			magicLoginEnabled,
			magicLoginView,
			translate,
		} = this.props;

		if ( magicLoginEnabled && magicLoginView === REQUEST_FORM ) {
			return <a href="#" key="enter-password-link" onClick={ this.onClickEnterPasswordInstead }>{ translate( 'Enter a password instead' ) }</a>;
		}

		const showMagicLoginLink = magicLoginEnabled && ! magicLoginView &&
			<a href="#" key="magic-login-link" onClick={ this.onMagicLoginRequestClick }>{ translate( 'Email me a login link' ) }</a>;
		const resetPasswordLink = ! magicLoginView &&
			<a href={ config( 'login_url' ) + '?action=lostpassword' } key="lost-password-link">{ this.props.translate( 'Lost your password?' ) }</a>;
		const goBackLink = ! magicLoginView &&
			<a href="#" key="back-link" onClick={ this.goBack }><Gridicon icon="arrow-left" size={ 18 } /> { this.props.translate( 'Back' ) }</a>;

		return compact( [
			showMagicLoginLink,
			resetPasswordLink,
			goBackLink,
		] );
	}

	render() {
		const {
			magicLoginView,
			queryArguments,
			translate,
		} = this.props;

		return (
			<Main className="wp-login">
				{ this.magicLoginMainContent() || (
					<div>
						<div className="wp-login__container">
							{ magicLoginView === REQUEST_FORM
								? <RequestLoginEmailForm />
								: <LoginBlock
									redirectLocation={ queryArguments.redirect_to }
									title={ translate( 'Log in to your account.' ) } />
							}
						</div>
						<div className="wp-login__footer">
							{ this.footerLinks() }
						</div>
					</div>
				) }
			</Main>
		);
	}
}

const mapState = state => {
	const magicLoginEnabled = isEnabled( 'magic-login' );
	return {
		magicLoginEnabled,
		magicLoginEmailAddress: getMagicLoginEmailAddressFormInput( state ),
		magicLoginView: magicLoginEnabled ? getMagicLoginCurrentView( state ) : null,
		queryArguments: getCurrentQueryArguments( state ),
	};
};

const mapDispatch = {
	hideMagicLoginRequestForm,
	showMagicLoginInterstitialPage,
	showMagicLoginRequestForm,
	recordTracksEvent,
	recordPageView,
};

export default connect( mapState, mapDispatch )( localize( Login ) );
