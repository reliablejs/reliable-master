'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {

  describe('GET /', () => {
    it('should be ok', () => {
      return app.httpRequest()
        .get('/')
        .expect(/Reliable Suites for Macaca/)
        .expect(200);
    });

    it('should be ok with site config', async () => {
      const ctx = app.mockContext();
      await ctx.model.Config.create({
        data: {
          site: {
            assetsUrl: 'https://foo',
          },
        },
      });
      return app.httpRequest()
        .get('/');
    });
  });
});
