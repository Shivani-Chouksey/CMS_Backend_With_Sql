


// Health Check route
/**
 * @swagger
 * /health-check:
 *   get:
 *     tags:
 *        - HealthCheck
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */


/**
 * @swagger
 * /cms-user/create-cms-super-admin:
 *   post:
 *     tags:
 *       - CMS User
 *     summary: Register CMS Super Admin
 *     description: Register a new Super Admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: superadmin123
 *               password:
 *                 type: string
 *                 example: StrongPassword@123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: superadmin@example.com
 *               role:
 *                 type: string
 *                 example: SuperAdmin
 *     responses:
 *       201:
 *         description: User Created Successfully
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /cms-user/login:
 *   post:
 *     tags:
 *       - CMS User
 *     summary: Login Super-admin or Admin
 *     description: Authenticates a CMS user and returns a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: superAdmin1@gmail.com
 *               password:
 *                 type: string
 *                 example: chouksey
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /cms-user/all-cms-user:
 *   get:
 *     tags:
 *       - CMS User
 *     summary: Get all CMS users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A successful response
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /cms-user/create-cms-admin:
 *   post:
 *     tags:
 *       - CMS User
 *     summary: Register CMS  Admin
 *     security:
 *       - bearerAuth: []
 *     description: Register a new CMS Admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: StrongPassword@123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: User Created Successfully
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */


