import express from 'express';
const router = express.Router();

import { gerarPdfGeral, gerarPdfIndividual } from '../controllers/pdfController.js';

router.get('/todos', gerarPdfGeral);
router.get('/:id', gerarPdfIndividual);

export default router;