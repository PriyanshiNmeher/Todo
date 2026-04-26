'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::todo.todo', ({ strapi }) => ({
  async create(ctx) {
     const user = ctx.state.user;
     if (!user) return ctx.unauthorized('You must be logged in to create a todo.');
     
     const { title, isCompleted } = ctx.request.body.data || {};
     
     // Bypass REST validator completely by ignoring super.create
     const newTodo = await strapi.documents('api::todo.todo').create({
        data: {
           title,
           isCompleted: isCompleted || false,
           user: user.documentId
        },
        populate: ['user']
     });
     
     const sanitizedEntity = await this.sanitizeOutput(newTodo, ctx);
     return this.transformResponse(sanitizedEntity);
  },

  async find(ctx) {
     const user = ctx.state.user;
     if (!user) return ctx.unauthorized();
     
     const todos = await strapi.documents('api::todo.todo').findMany({
        filters: {
           user: {
              documentId: {
                 $eq: user.documentId
              }
           }
        },
        populate: ['user']
     });
     
     const sanitizedEntities = await this.sanitizeOutput(todos, ctx);
     return this.transformResponse(sanitizedEntities);
  },

  async update(ctx) {
     const user = ctx.state.user;
     if (!user) return ctx.unauthorized();
     
     const { id } = ctx.params;
     const { isCompleted } = ctx.request.body.data || {};
     
     const existingTodo = await strapi.documents('api::todo.todo').findOne({
        documentId: id,
        populate: ['user']
     });
     
     if (!existingTodo || existingTodo.user?.documentId !== user.documentId) {
        return ctx.unauthorized('Not allowed');
     }
     
     const updatedLog = await strapi.documents('api::todo.todo').update({
        documentId: id,
        data: {
           isCompleted
        }
     });
     
     const sanitizedEntity = await this.sanitizeOutput(updatedLog, ctx);
     return this.transformResponse(sanitizedEntity);
  },
  
  async delete(ctx) {
     const user = ctx.state.user;
     if (!user) return ctx.unauthorized();
     
     const { id } = ctx.params;
     
     const existingTodo = await strapi.documents('api::todo.todo').findOne({
        documentId: id,
        populate: ['user']
     });
     
     if (!existingTodo || existingTodo.user?.documentId !== user.documentId) {
        return ctx.unauthorized('Not allowed');
     }
     
     const deletedLog = await strapi.documents('api::todo.todo').delete({
        documentId: id
     });
     
     const sanitizedEntity = await this.sanitizeOutput(deletedLog, ctx);
     return this.transformResponse(sanitizedEntity);
  }
}));
