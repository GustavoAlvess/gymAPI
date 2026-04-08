import express from 'express';
import 'dotenv/config';
import alunoRoutes from './routes/alunoRoutes.js';
import treinoRoutes from './routes/treinoRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas

app.use('/treinos', treinoRoutes);
app.use('/alunos', alunoRoutes);
app.use('/alunos/pdf', pdfRoutes);
app.use('/uploads', express.static('uploads'));


app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
