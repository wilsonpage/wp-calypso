/**
 * External dependencies
 */
import request from 'superagent';

/**
 * Internal dependencies
 */
import {
	GRAVATAR_RECEIVE_IMAGE_FAILURE,
	GRAVATAR_UPLOAD_RECEIVE,
	GRAVATAR_UPLOAD_REQUEST,
	GRAVATAR_UPLOAD_REQUEST_SUCCESS,
	GRAVATAR_UPLOAD_REQUEST_FAILURE
} from 'state/action-types';
import {
	bumpStat,
	recordTracksEvent,
	recordGoogleEvent,
} from 'state/analytics/actions';

export function uploadGravatar( file, bearerToken, email ) {
	return dispatch => {
		dispatch( { type: GRAVATAR_UPLOAD_REQUEST } );
		dispatch( recordTracksEvent( 'calypso_edit_gravatar_upload_start' ) );

		const data = new FormData();
		data.append( 'filedata', file );
		data.append( 'account', email );
		return request
			.post( 'https://api.gravatar.com/v1/upload-image' )
			.send( data )
			.set( 'Authorization', 'Bearer ' + bearerToken )
			.then( () => {
				const fileReader = new FileReader( file );
				fileReader.addEventListener( 'load', function() {
					dispatch( {
						type: GRAVATAR_UPLOAD_RECEIVE,
						src: fileReader.result,
					} );
					dispatch( {
						type: GRAVATAR_UPLOAD_REQUEST_SUCCESS
					} );
					dispatch( recordTracksEvent( 'calypso_edit_gravatar_upload_success' ) );
				} );
				fileReader.readAsDataURL( file );
			} )
			.catch( () => {
				dispatch( {
					type: GRAVATAR_UPLOAD_REQUEST_FAILURE
				} );
				dispatch( recordTracksEvent( 'calypso_edit_gravatar_upload_failure' ) );
				dispatch( bumpStat( 'calypso_gravatar_update_error', 'unsuccessful_http_response' ) );
			} );
	};
}

export function receiveGravatarImageFailed( { errorMessage, statName } ) {
	return dispatch => {
		dispatch( recordTracksEvent( 'calypso_edit_gravatar_file_recieve_failure' ) );
		dispatch( bumpStat( 'calypso_gravatar_update_error', statName ) );
		dispatch( {
			type: GRAVATAR_RECEIVE_IMAGE_FAILURE,
			errorMessage,
		} );
	};
}

export function clickButton( { isVerified } ) {
	return dispatch => {
		dispatch( recordTracksEvent( 'calypso_edit_gravatar_click', { userVerified: isVerified } ) );
		dispatch( recordGoogleEvent( 'Me', 'Clicked on Edit Gravatar Button in Profile' ) );
	};
}

export function receiveImage() {
	return dispatch => {
		dispatch( recordTracksEvent( 'calypso_edit_gravatar_file_receive' ) );
	};
}
