import express from 'express';
const router = express.Router();

import {
    gerarPdfGeral,
    gerarPdfIndividual,
    gerarPdfTreinoIndividual,
    gerarPdfGeralTreinos
} from '../controllers/pdfController.js';

// Rotas de ALUNOS
router.get('/aluno/:id', gerarPdfIndividual);

// Rotas de TREINOS
router.get('/treino/:id', gerarPdfTreinoIndividual);
router.get('/treinos/todos', gerarPdfGeralTreinos);

export default router;
