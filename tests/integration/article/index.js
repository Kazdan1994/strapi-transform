const {it, describe, expect} = require('@jest/globals');
const request = require('supertest');
const {createUser, jwt, grantPrivilege} = require('../../helpers/strapi');

describe('articles test', () => {
  it('should get author articles', async () => {
    const user = await createUser();
    const token = await jwt(user.id);

    await strapi.query('api::article.article').create({
      data: {
        title: 'Article de test',
        author: user.id,
      }
    });

    await grantPrivilege(1, 'api::article.controllers.article.myArticles');

    const response = await request(strapi.server.httpServer)
      .get('/api/myArticles')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    console.log(response.body);

    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).not.toHaveProperty('attributes');
  });
});
