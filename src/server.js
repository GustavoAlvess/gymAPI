import express from 'express';
import 'dotenv/config';
import alunoRoutes from './routes/alunoRoutes.js';
import treinoRoutes from './routes/treinoRoutes.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
<<<<<<< HEAD
app.use('/treinos', treinoRoutes);
app.use('/alunos', alunoRoutes);
=======
app.use('/api', treinoRoutes);
app.use('/api', alunoRoutes);
app.use('/uploads', express.static('uploads'));
>>>>>>> 8cbc27b70f4202f0c479da8261ebc997dbca3d83

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
