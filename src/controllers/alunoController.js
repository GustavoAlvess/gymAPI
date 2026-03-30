import AlunoModel from '../models/alunoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, email, telefone, cep} = req.body;

        if (!nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        
        
        let enderecoAutomatico = {};
        if (cep) {
            const dadosCep = await buscarEnderecoNoViaCep(cep);
            if (dadosCep) {
                enderecoAutomatico = {
                    logradouro: dadosCep.logradouro,
                    bairro: dadosCep.bairro,
                    localidade: dadosCep.localidade,
                    uf: dadosCep.uf
                };
            }
        }

        const alunoData = {
            nome,
            email,
            telefone,
            cep,
            logradouro: enderecoAutomatico.logradouro || req.body.logradouro,
            bairro: enderecoAutomatico.bairro || req.body.bairro,
            localidade: enderecoAutomatico.localidade || req.body.localidade,
            uf: enderecoAutomatico.uf || req.body.uf
        };

        const aluno = new AlunoModel(alunoData);

        const data = await aluno.criar();

        res.status(201).json({ message: 'Aluno criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({error: error.message || 'Erro interno.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const alunos = await AlunoModel.buscarTodos(req.query);

        if (!alunos || alunos.length === 0) {
            return res.status(200).json({ message: 'Nenhum aluno encontrado.' });
        }

        res.json(alunos);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar alunos.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }

        res.json({ data: aluno });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar aluno.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) aluno.nome = req.body.nome;
        if (req.body.email !== undefined) aluno.email = req.body.email;
        if (req.body.telefone, cep, logradouro, bairro, localidade, uf !== undefined) aluno.telefone, cep, logradouro, bairro, localidade, uf = req.body.telefone, cep, logradouro, bairro, localidade, uf;
        if (req.body.foto !== undefined) aluno.foto = req.body.foto;

        const data = await aluno.atualizar();

        res.json({ message: `O aluno "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar aluno.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const aluno = await AlunoModel.buscarPorId(parseInt(id));

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado para deletar.' });
        }

        await aluno.deletar();

        res.json({ message: `O aluno "${aluno.nome}" foi deletado com sucesso!`, deletado: aluno });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar aluno.' });
    }
};
