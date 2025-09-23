import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Rest API CMS_SQL_Backend Docs',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1', // Adjust to your server URL
                description: 'Development server',
            },
            {
                url: 'https://cmsbackendwithsql-production.up.railway.app/api/v1', // Adjust to your server URL
                description: 'Production server',
            },
        ],
        components:{
            securitySchemes:{
                bearerAuth:{
                    type:'http',
                    schema:"bearer",
                    bearerFormat:'JWT'
                }
            }
        },
        // security:[
        //     {
        //         bearerAuth:[]
        //     }
        // ],

    tags: [
      {
        name: 'HealthCheck',
        description: 'Endpoints for system health monitoring',
      },
      {
        name: 'CMS User',
        description: 'Endpoints related to CMS user management',
      },
    ],

    },
    apis: ['./swagger_docs/*.js'], // files containing annotations as above
    // apis: ['./routes/*.js','./server.js'], // files containing annotations as above
};

export const apiSpecification = swaggerJSDoc(options);
