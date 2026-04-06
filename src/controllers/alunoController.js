import AlunoModel from '../models/alunoModel.js';
import fetch from 'node-fetch';

const buscarEnderecoNoViaCep = async (cep) => {
    try {
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) return null;

        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) return null;

        return data;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
};

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio.' });
        }

        const { nome, email, telefone, cep } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'Nome é obrigatório!' });
        }

        let enderecoAutomatico = {};

        if (cep) {
            const dadosCep = await buscarEnderecoNoViaCep(cep);

            if (dadosCep) {
                enderecoAutomatico = {
                    logradouro: dadosCep.logradouro,
                    bairro: dadosCep.bairro,
                    localidade: dadosCep.localidade,
                    uf: dadosCep.uf,
                };
            }
        }

        const aluno = new AlunoModel({
            nome,
            email,
            telefone,
            cep,
            logradouro: enderecoAutomatico.logradouro || req.body.logradouro,
            bairro: enderecoAutomatico.bairro || req.body.bairro,
            localidade: enderecoAutomatico.localidade || req.body.localidade,
            uf: enderecoAutomatico.uf || req.body.uf,
        });

        const data = await aluno.criar();

        res.status(201).json({ message: 'Aluno criado com sucesso!', data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar aluno.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const alunos = await AlunoModel.buscarTodos(req.query);

        if (!alunos || alunos.length === 0) {
            return res.json({ message: 'Nenhum aluno encontrado.' });
        }

        res.json(alunos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar alunos.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const aluno = await AlunoModel.buscarPorId(id);

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }

        res.json(aluno);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar aluno.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const aluno = await AlunoModel.buscarPorId(id);

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }

        if (req.body.nome !== undefined) aluno.nome = req.body.nome;
        if (req.body.email !== undefined) aluno.email = req.body.email;
        if (req.body.telefone !== undefined) aluno.telefone = req.body.telefone;
        if (req.body.cep !== undefined) aluno.cep = req.body.cep;
        if (req.body.logradouro !== undefined) aluno.logradouro = req.body.logradouro;
        if (req.body.bairro !== undefined) aluno.bairro = req.body.bairro;
        if (req.body.localidade !== undefined) aluno.localidade = req.body.localidade;
        if (req.body.uf !== undefined) aluno.uf = req.body.uf;
        if (req.body.foto !== undefined) aluno.foto = req.body.foto;

        const data = await aluno.atualizar();

        res.json({ message: 'Aluno atualizado com sucesso!', data });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar aluno.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const aluno = await AlunoModel.buscarPorId(id);

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }

        await aluno.deletar();

        res.json({ message: 'Aluno deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar aluno.' });
    }
};
