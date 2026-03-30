import fs from 'fs/promises';
import alunoModel from '../models/alunoModel.js';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const aluno = await alunosModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Registro de aluno não encontrado.' });
        }
        if (!aluno.foto) {
            return res.status(404).json({
                error: 'Este aluno não possui foto cadastrada',
            });
        }
        return res.sendFile(aluno.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Nenhuma foto enviada.' });
    }
};

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma foto enviada!' });
        }

        const { id } = req.params;

        if (isNaN(id))
            return res.status(400).json({ error: 'O ID enviado não é um número válido' });

        const aluno = await alunoModel.buscarPorId(parseInt(id));
        if (!aluno) {
            removerFoto(req.file.path);
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        if (aluno.foto) {
            await fs.unlink(aluno.foto).catch(() => {});
        }

        aluno.foto = await processarFoto(req.file.path);
        await aluno.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: aluno.foto });
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar a foto.' });
    }
};
