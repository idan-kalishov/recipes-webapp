import express, { Request, Response } from 'express';
import * as commentsController from '../controllers/commentsController'; // Adjust the import if necessary

const commentsRoutes = express.Router();
/**
* @swagger
* tags:
*   name: Comments
*   description: The Comments API
*/

// Define routes and associate them with the controller methods
commentsRoutes.get('/', (req: Request, res: Response) => commentsController.getAllComments(req, res));
commentsRoutes.get('/:comment_id', (req: Request, res: Response) => commentsController.getCommentById(req, res));
commentsRoutes.get('/:post_id', (req: Request, res: Response) => commentsController.getCommentsByPostId(req, res));
commentsRoutes.post('/', (req: Request, res: Response) => commentsController.createComment(req, res));
commentsRoutes.delete('/:comment_id', (req: Request, res: Response) => commentsController.deleteComment(req, res));
commentsRoutes.put('/:comment_id', (req: Request, res: Response) => commentsController.updateComment(req, res));

export default commentsRoutes;
