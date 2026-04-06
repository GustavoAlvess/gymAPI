import TreinoModel from '../models/treinoModel.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const CATEGORIAS_VALIDAS = ['FLEXIBILIDADE', 'MUSCULACAO', 'FUNCIONAL', 'CARDIO'];

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio.' });
        }

        const { nome, descricao, categoria, disponivel } = req.body;

        if (!nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        if (!categoria) return res.status(400).json({ error: 'A "categoria" é obrigatória!' });

        if (!CATEGORIAS_VALIDAS.includes(categoria.toUpperCase())) {
            return res.status(400).json({
                error: 'Categoria inválida. Use: ' + CATEGORIAS_VALIDAS.join(', '),
            });
        }

        const treinoData = {
            nome,
            descricao,
            categoria: categoria.toUpperCase(),
            disponivel: disponivel ?? true,
        };

        const treino = new TreinoModel(treinoData);
        const data = await treino.criar();

        res.status(201).json({ message: 'Treino criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar treino:', error);
        res.status(500).json({ error: error.message || 'Erro interno.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const treinos = await TreinoModel.buscarTodos(req.query);

        if (!treinos || treinos.length === 0) {
            return res.status(200).json({ message: 'Nenhum treino encontrado.' });
        }

        res.json(treinos);
    } catch (error) {
        console.error('Erro ao buscar treinos:', error);
        res.status(500).json({ error: 'Erro ao buscar treinos.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const treino = await TreinoModel.buscarPorId(parseInt(id));

        if (!treino) {
            return res.status(404).json({ error: 'Treino não encontrado.' });
        }

        res.json({ data: treino });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar treino.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const treino = await TreinoModel.buscarPorId(parseInt(id));
        if (!treino) return res.status(404).json({ error: 'Treino não encontrado.' });

        if (req.body.nome !== undefined) treino.nome = req.body.nome;
        if (req.body.descricao !== undefined) treino.descricao = req.body.descricao;
        if (req.body.categoria !== undefined) {
            if (!CATEGORIAS_VALIDAS.includes(req.body.categoria.toUpperCase())) {
                return res.status(400).json({ error: 'Categoria inválida.' });
            }
            treino.categoria = req.body.categoria.toUpperCase();
        }
        if (req.body.disponivel !== undefined) treino.disponivel = req.body.disponivel;

        const data = await treino.atualizar();
        res.json({ message: 'Treino atualizado com sucesso!', data });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar treino.' });
    }
};

export const uploadFoto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) return res.status(400).json({ error: 'Nenhuma foto enviada.' });

        const treino = await TreinoModel.buscarPorId(parseInt(id));
        if (!treino) return res.status(404).json({ error: 'Treino não encontrado.' });

        const nomeArquivo = `treino-${id}-${Date.now()}.jpg`;
        const pastaUploads = path.join(process.cwd(), 'uploads');
        const caminhoCompleto = path.join(pastaUploads, nomeArquivo);

        if (!fs.existsSync(pastaUploads)) fs.mkdirSync(pastaUploads);

        await sharp(req.file.buffer).resize(800).jpeg({ quality: 80 }).toFile(caminhoCompleto);

        if (treino.foto && fs.existsSync(path.join(process.cwd(), treino.foto))) {
            fs.unlinkSync(path.join(process.cwd(), treino.foto));
        }

        treino.foto = `uploads/${nomeArquivo}`;
        await treino.atualizar();

        res.json({ message: 'Foto enviada com sucesso!', foto: treino.foto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar foto.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;
        const treino = await TreinoModel.buscarPorId(parseInt(id));

        if (!treino) return res.status(404).json({ error: 'Treino não encontrado.' });

        await treino.deletar();
        res.json({ message: `Treino "${treino.nome}" deletado com sucesso!` });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar treino.' });
    }
};
