/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /api/login:
 *   post:
 *     summary: find user with email and password
 *     tags: [Books]
 *     parameters:
 *       - in:
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email user
 *
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */