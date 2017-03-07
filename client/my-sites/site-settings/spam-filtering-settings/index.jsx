/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import FoldableCard from 'components/foldable-card';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import InfoPopover from 'components/info-popover';
import ExternalLink from 'components/external-link';
import { isJetpackModuleActive } from 'state/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';
import { updateSettings } from 'state/jetpack/settings/actions';
import FormSettingExplanation from 'components/forms/form-setting-explanation';

const SpamFilteringSettings = ( {
	akismetActive,
	isRequestingSettings,
	isSavingSettings,
	onChangeField,
	translate
} ) => {
	const header = akismetActive
		? translate( 'Your site is protected from spam' )
		: translate( 'Install & activate Spam filtering' );
	return (
		<div>
			<FoldableCard header={ header }>
				<div className="spam-filtering-settings__module-settings">
						<div className="spam-filtering-settings__info-link-container site-settings__info-link-container">
							<InfoPopover >
								<ExternalLink target="_blank" icon href={ 'https://jetpack.com/features/security/spam-filtering/' } >
									{ translate( 'Learn more about Spam filtering.' ) }
								</ExternalLink>
							</InfoPopover>
						</div>
					<FormFieldset>
						<FormLabel>{ translate( 'Your API Key ' ) }</FormLabel>
						<FormTextInput
							disabled={ isRequestingSettings || isSavingSettings }
							onChange={ onChangeField( 'wordpress_api_key' ) }
							/>
						<FormSettingExplanation>
							{ translate(
								'If you don\'t already have an API key, then {{ExternalLink}}Get your API key here{{/ExternalLink}},' +
								' and you\'ll be guided through the process of getting one in a new window.',
								{
									components: {
										ExternalLink: <ExternalLink icon href="https://akismet.com/wordpress/" target="_blank" />
									}
								}
							) }
						</FormSettingExplanation>
					</FormFieldset>
				</div>
			</FoldableCard>
		</div>
	);
};

SpamFilteringSettings.propTypes = {
	akismetActive: PropTypes.bool.isRequired,
	isSavingSettings: PropTypes.bool,
	isRequestingSettings: PropTypes.bool,
	handleField: PropTypes.func,
	siteId: PropTypes.number.isRequired,
	fields: PropTypes.object
};

export default connect(
	( state ) => {
		const selectedSiteId = getSelectedSiteId( state );
		return {
			siteId: selectedSiteId,
			akismetActive: true,
			akismetActive2: !! isJetpackModuleActive( state, selectedSiteId, 'akismet' )
		};
	},
	{
		updateSettings
	}
)( localize( SpamFilteringSettings ) );
