/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { get, find } from 'lodash';

/**
 * Internal dependencies
 */
import FoldableCard from 'components/foldable-card';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import InfoPopover from 'components/info-popover';
import ExternalLink from 'components/external-link';
import { getSelectedSiteId, getSelectedSiteSlug } from 'state/ui/selectors';
import { updateSettings } from 'state/jetpack/settings/actions';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import { getPluginsForSite } from 'state/plugins/premium/selectors';

const SpamFilteringSettings = ( {
	akismetActive,
	akismetKey,
	fields,
	isRequestingSettings,
	isSavingSettings,
	onChangeField,
	siteSlug,
	translate
} ) => {
	const header = akismetActive
		? translate( 'Your site is protected from spam' )
		: (
			<div>
				<div>
					{ translate( 'Your site is not protected from spam.' ) }
				</div>
				<FormSettingExplanation>
						{
							translate( '{{link}} Install & activate Akismet on your site{{/link}}.', {
								components: {
									link: <a
										href={ `/plugins/${ siteSlug }` } />
								}
							} )
						}
				</FormSettingExplanation>
			</div>
		);

	return (
		<div>
			<FoldableCard header={ header }>
				<div className="spam-filtering-settings__module-settings">
						<div className="spam-filtering-settings__info-link-container site-settings__info-link-container">
							<InfoPopover >
								<ExternalLink target="_blank" icon href={ 'https://jetpack.com/features/security/spam-filtering/' } >
									{ translate( 'Learn more about spam filtering.' ) }
								</ExternalLink>
							</InfoPopover>
						</div>
					<FormFieldset>
						<FormLabel>{ translate( 'Your API Key ' ) }</FormLabel>
						<FormTextInput
							value={ fields.wordpress_api_key || akismetKey || '' }
							disabled={ ! akismetActive || isRequestingSettings || isSavingSettings }
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
		const plugins = getPluginsForSite( state, selectedSiteId );
		return {
			siteId: selectedSiteId,
			siteSlug: getSelectedSiteSlug( state ),
			akismetKey: get( find( plugins, { name: 'akismet' } ), 'key' )
		};
	},
	{
		updateSettings
	}
)( localize( SpamFilteringSettings ) );
