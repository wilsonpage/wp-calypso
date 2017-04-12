/**
 * External dependencies
 */
import { expect } from 'chai';
import { spy } from 'sinon';

/**
 * Internal dependencies
 */
import useNock, { nock } from 'test/helpers/use-nock';
import { extendAction } from 'state/utils';
import {
	failureMeta,
	fetcherMap,
	queueRequest,
	successMeta,
} from '../';

const processInbound = action => action;
const processOutbound = ( action, store, data, error ) => ( {
	failures: [ action.onFailure ],
	nextData: data,
	nextError: error,
	successes: [ action.onSuccess ],
} );

const http = queueRequest( processInbound, processOutbound );

const succeeder = { type: 'SUCCESS' };
const failer = { type: 'FAIL' };

const getMe = {
	method: 'GET',
	path: '/me',
	query: {
		apiVersion: '1.1',
	},
	onFailure: failer,
	onSuccess: succeeder,
};

describe( '#queueRequest', () => {
	let dispatch;
	let next;

	useNock();

	beforeEach( () => {
		dispatch = spy();
		next = spy();
	} );

	it( 'should call `onSuccess` when a response returns with data', done => {
		const data = { value: 1 };
		nock( 'https://public-api.wordpress.com:443' ).get( '/rest/v1.1/me' ).reply( 200, data );

		http( { dispatch }, getMe, next );

		expect( next ).to.have.been.calledWith( getMe );

		setTimeout( () => {
			expect( dispatch ).to.have.been.calledOnce;
			expect( dispatch ).to.have.been.calledWith( extendAction( succeeder, successMeta( data ) ) );
			done();
		}, 10 );
	} );

	it( 'should call `onFailure` when a response returns with an error', done => {
		const error = { error: 'bad' };
		nock( 'https://public-api.wordpress.com:443' ).get( '/rest/v1.1/me' ).replyWithError( error );

		http( { dispatch }, getMe, next );

		expect( next ).to.have.been.calledWith( getMe );

		setTimeout( () => {
			expect( dispatch ).to.have.been.calledOnce;
			expect( dispatch ).to.have.been.calledWith( extendAction( failer, failureMeta( error ) ) );
			done();
		}, 10 );
	} );
} );

describe( '#fetcherMap', () => {
	const wpcomReq = {};
	const noopCallback = () => {};

	describe( 'GET', () => {
		let getFooAction;

		beforeEach( () => {
			wpcomReq.get = spy();
			getFooAction = {
				method: 'GET',
				path: '/foo',
			};
		} );

		it( 'should send with query', () => {
			getFooAction.query = {
				apiVersion: 'v2.0',
				apiNamespace: 'wp/v2',
			};

			fetcherMap( 'GET', wpcomReq )( getFooAction, noopCallback );

			expect( wpcomReq.get ).to.have.been.calledWith(
				{ path: '/foo' },
				{
					apiVersion: 'v2.0',
					apiNamespace: 'wp/v2',
				},
				noopCallback
			);
		} );
	} );

	describe( 'POST', () => {
		let postFooAction;

		beforeEach( () => {
			wpcomReq.post = spy();
			postFooAction = {
				method: 'POST',
				path: '/foo',
			};
		} );

		it( 'should send formData with query', () => {
			postFooAction.formData = [ [ 'foo', 'bar' ], ];
			postFooAction.query = { apiVersion: 'v1.1' };

			fetcherMap( 'POST', wpcomReq )( postFooAction, noopCallback );

			expect( wpcomReq.post ).to.have.been.calledWith(
				{
					path: '/foo',
					formData: [ [ 'foo', 'bar' ], ],
				},
				{
					apiVersion: 'v1.1',
				},
				null,
				noopCallback
			);
		} );

		it( 'it should prioritize formData over body', () => {
			postFooAction.formData = [ [ 'foo', 'bar' ], ];
			postFooAction.body = { lorem: 'ipsum' };

			fetcherMap( 'POST', wpcomReq )( postFooAction, noopCallback );

			expect( wpcomReq.post ).to.have.been.calledWith(
				{
					path: '/foo',
					formData: [ [ 'foo', 'bar' ], ],
				},
				{ },
				null,
				noopCallback
			);
		} );

		it( 'should send body in the absence of any formData', () => {
			postFooAction.body = { lorem: 'ipsum' };

			fetcherMap( 'POST', wpcomReq )( postFooAction, noopCallback );

			expect( wpcomReq.post ).to.have.been.calledWith(
				{ path: '/foo' },
				{ },
				{ lorem: 'ipsum' },
				noopCallback
			);
		} );
	} );
} );
