'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({strapi}) => ({
  async myArticles(ctx) {
    const user = ctx.state.user;
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    sanitizedQueryParams.filters = {
      ...(ctx.query.filters || {}),
      author: user.id
    };

    const {results, pagination} = await strapi.service('api::article.article').find(sanitizedQueryParams);
    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, {pagination});
  },
}));
