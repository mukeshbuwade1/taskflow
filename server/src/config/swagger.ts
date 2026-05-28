// eslint-disable-next-line @typescript-eslint/no-require-imports
const swaggerJsdoc = require('swagger-jsdoc') as (options: { definition: Record<string, unknown>; apis: string[] }) => Record<string, unknown>;

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Task Management API', version: '1.0.0', description: 'REST API for Task Management Application' },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'completed'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: { type: 'string', format: 'date-time' },
            user: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: { success: { type: 'boolean', example: false }, message: { type: 'string' } },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export default swaggerJsdoc(options);
