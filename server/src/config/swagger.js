const swaggerJsdoc = require('swagger-jsdoc');

const getServerUrls = () => {
  const port = process.env.PORT || 5000;
  const devUrl = `http://localhost:${port}/api/v1`;
  const baseUrl = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : null;
  const prodUrl = baseUrl ? `${baseUrl}/api/v1` : null;

  const servers = [
    {
      url: devUrl,
      description: 'Development server',
    },
  ];

  if (prodUrl) {
    servers.push({
      url: prodUrl,
      description: 'Configured server',
    });
  }

  return servers;
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FeroCrafts HRMS API',
      version: '1.0.0',
      description: 'Human Resource Management System API for managing employees, attendance, and payroll',
      contact: {
        name: 'FeroCrafts',
        email: 'support@ferocrafts.com',
      },
    },
    servers: getServerUrls(),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            role: {
              type: 'string',
              enum: ['employee', 'manager', 'admin'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        EmployeeProfile: {
          type: 'object',
          required: ['user', 'name', 'phoneNumber', 'aadhaarNo'],
          properties: {
            _id: {
              type: 'string',
            },
            user: {
              type: 'string',
              description: 'Reference to User ID',
            },
            name: {
              type: 'string',
            },
            phoneNumber: {
              type: 'string',
            },
            aadhaarNo: {
              type: 'string',
            },
            dob: {
              type: 'string',
              format: 'date',
            },
            bankDetails: {
              type: 'object',
              properties: {
                accountNumber: { type: 'string' },
                ifscCode: { type: 'string' },
              },
            },
            upiId: {
              type: 'string',
            },
          },
        },
        Attendance: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            employeeId: {
              type: 'string',
            },
            date: {
              type: 'string',
              format: 'date',
            },
            checkInTime: {
              type: 'string',
              format: 'date-time',
            },
            checkOutTime: {
              type: 'string',
              format: 'date-time',
            },
            selfieUrl: {
              type: 'string',
            },
            location: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['Point'],
                },
                coordinates: {
                  type: 'array',
                  items: {
                    type: 'number',
                  },
                },
              },
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
            },
          },
        },
        ClientSite: {
          type: 'object',
          required: ['name', 'location'],
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            location: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
          },
        },
        Payout: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            employeeId: {
              type: 'string',
            },
            period: {
              type: 'string',
              description: 'Period in YYYY-MM format',
            },
            totalDaysWorked: {
              type: 'number',
            },
            grossPay: {
              type: 'number',
            },
            deductions: {
              type: 'number',
            },
            netPay: {
              type: 'number',
            },
            status: {
              type: 'string',
              enum: ['generated', 'paid'],
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

