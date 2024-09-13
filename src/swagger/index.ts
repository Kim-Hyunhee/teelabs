import swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "teelabs",
      version: "1.0.0",
      description: "teelabs with typeorm",
    },
    host: "localhost:8001",
    basePath: "/",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/router/*.ts", "src/swagger/*.yml"],
};
const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
