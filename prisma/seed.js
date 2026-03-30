import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabela exemplo...');

    // Remove todos os registros
    // await prisma.exemplo.deleteMany();

    console.log('📦 Inserindo novos registros...');

    await prisma.aluno.createMany({
        data: [
            {
                nome: 'Ricardo Silva',
                email: 'ricardo@email.com',
                telefone: '11911112222',
                cep: '01001-000',
                logradouro: 'Praça da Sé',
                bairro: 'Sé',
                localidade: 'São Paulo',
                uf: 'SP',
                ativo: true,
            },
            {
                nome: 'Ana Oliveira',
                email: 'ana@email.com',
                telefone: '21988887777',
                cep: '20040-002',
                logradouro: 'Avenida Rio Branco',
                bairro: 'Centro',
                localidade: 'Rio de Janeiro',
                uf: 'RJ',
                ativo: true,
            },
            {
                nome: 'Bruno Santos',
                email: 'bruno@email.com',
                telefone: '31977776666',
                cep: '30140-071',
                logradouro: 'Rua da Bahia',
                bairro: 'Lourdes',
                localidade: 'Belo Horizonte',
                uf: 'MG',
                ativo: true,
            },
            {
                nome: 'Carla Souza',
                email: 'carla@email.com',
                telefone: '41966665555',
                cep: '80020-100',
                logradouro: 'Rua XV de Novembro',
                bairro: 'Centro',
                localidade: 'Curitiba',
                uf: 'PR',
                ativo: true,
            },
            {
                nome: 'Daniel Lima',
                email: 'daniel@email.com',
                telefone: '51955554444',
                cep: '90010-001',
                logradouro: 'Rua dos Andradas',
                bairro: 'Centro Histórico',
                localidade: 'Porto Alegre',
                uf: 'RS',
                ativo: false,
            },
        ],
    });

    //  5 Treinos vinculados aos IDs (1 a 5)
    await prisma.treino.createMany({
        data: [
            {
                nome: 'Treino A',
                descricao: 'Foco em força',
                categoria: 'MUSCULACAO',
                disponivel: true,
                alunoId: 1,
            },
            {
                nome: 'Yoga Matinal',
                descricao: 'Flexibilidade',
                categoria: 'FLEXIBILIDADE',
                disponivel: true,
                alunoId: 2,
            },
            {
                nome: 'Corrida HIIT',
                descricao: 'Cardio intenso',
                categoria: 'CARDIO',
                disponivel: true,
                alunoId: 3,
            },
            {
                nome: 'Crossfit',
                descricao: 'Funcional bruto',
                categoria: 'FUNCIONAL',
                disponivel: true,
                alunoId: 4,
            },
            {
                nome: 'Musculação B',
                descricao: 'Resistência',
                categoria: 'MUSCULACAO',
                disponivel: true,
                alunoId: 5,
            },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
