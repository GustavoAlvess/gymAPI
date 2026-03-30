import prisma from '../utils/prismaClient.js';

export default class TreinoModel {
    constructor({ id, nome, descricao = null, categoria = null, disponivel = true, foto = null } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.disponivel = disponivel;
        this.foto = foto;

    }

    async criar() {
        return prisma.treino.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                disponivel: this.disponivel,
                foto: this.foto,

            },
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
        if (filtros.descricao) {
            where.descricao = { contains: filtros.descricao, mode: 'insensitive' };
        }
        if (filtros.categoria) {
            where.categoria = { contains: filtros.categoria, mode: 'insensitive' };
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
