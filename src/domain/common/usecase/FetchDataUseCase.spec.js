/* eslint-disable no-unused-vars */
const { describe, it } = require('mocha');
const { expect } = require('chai');
const FetchDataUseCase = require('./FetchDataUseCase');
const Request = require('../../request/Request');
const RequestStateEnum = require('../../request/RequestStateEnum');

describe('FetchDataUseCase', () => {
  const crawler = () => ({
    fetch: url => JSON.stringify({ key1: 'value1' }),
  });

  const brokenDataClient = () => ({
    fetch: (url) => { throw new Error(); },
  });

  const logger = () => {
    const logs = [];
    return {
      info: log => logs.push(log),
      error: log => logs.push(log),
      list: () => logs,
    };
  };

  it('should fetch data for request, create response and pass result into it', async () => {
    // given
    const request = new Request('1', 'json(http://example.com).key1', Date.now());
    const sut = new FetchDataUseCase(crawler(), logger());
    // when
    const { request: finalRequest, response } = await sut.fetchDataForRequest(request);
    // then
    expect(response.requestId).to.equal('1');
    expect(response.fetchedData).to.equal(JSON.stringify({ key1: 'value1' }));
    expect(sut.logger.list()).to.have.lengthOf(2);
  });

  it('should return request marked as failed if data fetch was failed', async () => {
    const request = new Request('1', 'json(http://example.com).key1', Date.now(), RequestStateEnum.PROCESSED);
    const sut = new FetchDataUseCase(brokenDataClient(), logger());
    // when
    const { request: finalRequest } = await sut.fetchDataForRequest(request);
    // then
    expect(finalRequest.state.name).to.equal('Failed');
    expect(sut.logger.list()).to.have.lengthOf(1);
  });
});
