const { prisma } = require('../utils/prisma');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class TreinoController {

    async criar(req, res) {
        try {
            const { nome, descricao, categoria, preco, disponivel } = req.body;

            if (!nome || !categoria || preco === undefined) {
                return res.status(400).json({ erro: 'Campo obrigatório não informado.' });
            }

            const categoriasValidas = ['HIPERTROFIA', 'EMAGRECIMENTO', 'FUNCIONAL', 'CARDIO'];
            if (!categoriasValidas.includes(categoria.toUpperCase())) {
                return res.status(400).json({ erro: 'Categoria inválida.' });
            }

            if (preco < 0) {
                return res.status(400).json({ erro: 'Preço deve ser maior ou igual a zero.' });
            }

            const treino = await prisma.treino.create({
                data: {
                    nome,
                    descricao,
                    categoria: categoria.toUpperCase(),
                    preco,
                    disponivel: disponivel ?? true,
                },
            });

            return res.status(201).json(treino);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro interno ao criar treino.' });
        }
    }

    async listar(req, res) {
        const { nome, categoria, disponivel } = req.query;
        try {
            const treinos = await prisma.treino.findMany({
                where: {
                    nome: nome ? { contains: nome } : undefined,
                    categoria: categoria ? categoria.toUpperCase() : undefined,
                    disponivel: disponivel !== undefined ? disponivel === 'true' : undefined,
                },
            });
            return res.status(200).json(treinos);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao listar treinos.' });
        }
    }

    async uploadFoto(req, res) {
        const { id } = req.params;
        try {
            const treino = await prisma.treino.findUnique({ where: { id: Number(id) } });
            if (!treino) return res.status(404).json({ erro: 'Registro não encontrado.' });
            if (!req.file) return res.status(400).json({ erro: 'Arquivo de imagem obrigatório.' });

            const nomeArquivo = `treino-${id}-${Date.now()}.jpg`;
            const caminhoFinal = path.join('uploads', nomeArquivo);

            await sharp(req.file.buffer).resize(800).jpeg({ quality: 80 }).toFile(caminhoFinal);

            if (treino.foto && fs.existsSync(treino.foto)) {
                fs.unlinkSync(treino.foto);
            }

            const atualizado = await prisma.treino.update({
                where: { id: Number(id) },
                data: { foto: caminhoFinal },
            });

            return res.status(200).json(atualizado);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro no processamento da imagem.' });
        }
    }

    async buscarFoto(req, res) {
        const { id } = req.params;
        const treino = await prisma.treino.findUnique({ where: { id: Number(id) } });

        if (!treino || !treino.foto) return res.status(404).json({ erro: 'Foto não encontrada.' });

        return res.sendFile(path.resolve(treino.foto));
    }
}

module.exports = new TreinoController();
