import prisma from '../utils/prismaClient.js';

export default class AlunoModel {
    constructor({ id, nome, email = null, telefone = null, cep = null, logradouro = null, bairro = null, localidade = null, uf = null, ativo = true} = {}) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

    async criar() {
        return prisma.aluno.create({
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },


        });
    }

    async atualizar() {
        return prisma.aluno.update({
            where: { id: this.id },
            data: { nome: this.nome, email: this.email, telefone: this.telefone, cep: this.cep, logradouro: this.logradouro, bairro: this.bairro, localidade: this.localidade, uf: this.uf, ativo: this.ativo

             },
        });
    }

    async deletar() {
        return prisma.aluno.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }

        if (!nome || nome.length < 3 || nome.length > 100) {
            throw new Error( 'O campo "nome" é obrigatório e deve conter entre 3 e 100 caracteres.');
        }

        if (filtros.email) {
            where.email = { contains: filtros.email, mode: 'insensitive' };
        }

        if (!email.includes('@') || !email.includes('.')) {
            throw new Error( 'O campo "email" deve ser um endereço de email válido. (Deve conter "@" e ".")' );
        }

        if (filtros.telefone !== undefined) {
            where.telefone = parseFloat(filtros.telefone);
        }

        if (!telefone.length < 10 || !telefone.length > 11) {
            throw new Error( 'O campo "telefone" deve conter 10 ou 11 dígitos.' );
        }

        if (filtros.cep) {
            where.cep = { contains: filtros.cep, mode: 'insensitive' };
        }

        if (!cep.length === 8 ) {
            throw new Error('O campo "CEP" deve conter 8 dígitos sem caracteres especiais');
        }

        if (filtros.logradouro) {
            where.logradouro = { contains: filtros.logradouro, mode: 'insensitive' };
        }

        if (filtros.bairro) {
            where.bairro = { contains: filtros.bairro, mode: 'insensitive' };
        }

        if (filtros.localidade) {
            where.localidade = { contains: filtros.localidade, mode: 'insensitive' };
        }

        if (filtros.uf) {
            where.uf = { contains: filtros.uf, mode: 'insensitive' };
        }

        if (filtros.ativo !== undefined) {
            where.ativo = filtros.ativo === 'true';
        }

        throw prisma.aluno.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.aluno.findUnique({ where: { id } });
        if (!data) {
            throw null;
        }
        throw new alunoModel(data);
    }
}
