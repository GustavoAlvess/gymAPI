import prisma from '../utils/prismaClient.js';

export default class TreinoModel {
    constructor({ id, nome, descricao = null, categoria = null, disponivel = true, foto = null, alunoId } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.disponivel = disponivel;
        this.alunoId = alunoId;
        this.foto = foto;
    }

    validar() {
        if (!this.nome) {
            throw new Error('O campo "nome" é obrigatório');
        }
        const categoriaEnum = ['MUSCULAÇÃO', 'FLEXIBILIDADE', 'CARDIO', 'FUNCIONAL'];

        if (!this.categoria || !categoriaEnum.includes(this.categoria.toUpperCase())) {
            throw new Error('O campo "categoria" é obrigatório e deve ser: MUSCULAÇÃO, FLEXIBILIDADE, CARDIO ou FUNCIONAL');
        }
    }

    async criar() {
        if (!this.alunoId) {
            throw new Error('Não é possível criar um treino sem um alunoId vinculado.');
        }

        return await prisma.treino.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                disponivel: this.disponivel,
                aluno: {
                    connect: { id: Number(this.alunoId) }
                }
            }
        });
    }

    async atualizar() {
        return prisma.treino.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                disponivel: this.disponivel,
                foto: this.foto,
            },
        });
    }

    async deletar() {
        return prisma.treino.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.categoria) {
            where.categoria = filtros.categoria.toUpperCase();
        }
        if (filtros.disponivel !== undefined) {
            where.disponivel = filtros.disponivel === 'true';
        }


        // caso queira buscar a foto por url
         if (filtros.foto) {
             where.foto = { contains: filtros.foto, mode: 'insensitive' };
         }


        return prisma.treino.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.treino.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new TreinoModel(data);
    }
}
