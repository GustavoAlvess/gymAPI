import prisma from '../utils/prismaClient.js';
import htmlPdf from 'html-pdf-node';
import fs from 'fs';

class PdfController {

    async gerarPdfIndividual(req, res) {
        try {
            const { id } = req.params;
            const aluno = await prisma.aluno.findUnique({
                where: { id: Number(id) },
                include: { treinos: true }
            });

            if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado.' });

            let fotoBase64 = '';
            if (aluno.foto && fs.existsSync(aluno.foto)) {
                const imagem = fs.readFileSync(aluno.foto);
                fotoBase64 = `data:image/jpeg;base64,${imagem.toString('base64')}`;
            }

            const nomesTreinos = aluno.treinos?.length > 0
                ? aluno.treinos.map(t => t.nome).join(', ')
                : 'Nenhum treino vinculado';

            const html = `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1 style="color: #2c3e50;">Ficha Técnica do Aluno</h1>
                    <hr/>
                    ${fotoBase64 ? `<img src="${fotoBase64}" style="width: 200px; border-radius: 10px; margin-bottom: 20px;"/>` : '<p><em>Sem foto cadastrada</em></p>'}
                    <p><strong>Nome:</strong> ${aluno.nome}</p>
                    <p><strong>Email:</strong> ${aluno.email || 'Não informado'}</p>
                    <p><strong>Status:</strong> ${aluno.ativo ? 'Ativo' : 'Inativo'}</p>
                    <hr/>
                    <h3 style="color: #2c3e50;">Treinos Vinculados</h3>
                    <p>${nomesTreinos}</p>
                </div>
            `;

            const pdfBuffer = await htmlPdf.generatePdf({ content: html }, { format: 'A4' });
            res.contentType('application/pdf');
            return res.send(pdfBuffer);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async gerarPdfGeral(req, res) {
        try {
            const alunos = await prisma.aluno.findMany({ include: { treinos: true } });
            const rows = alunos.map(a => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${a.nome}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${a.email || 'N/A'}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${a.treinos.map(t => t.nome).join(', ') || 'Nenhum'}</td>
                </tr>
            `).join('');

            const html = `
                <h1 style="font-family: sans-serif; text-align: center;">Relatório Geral de Alunos</h1>
                <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Nome</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Email</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Treinos</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            `;

            const pdfBuffer = await htmlPdf.generatePdf({ content: html }, { format: 'A4' });
            res.contentType('application/pdf');
            return res.send(pdfBuffer);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }


    async gerarPdfTreinoIndividual(req, res) {
        try {
            const { id } = req.params;
            const treino = await prisma.treino.findUnique({
                where: { id: Number(id) },
                include: { aluno: true }
            });

            if (!treino) return res.status(404).json({ erro: 'Treino não encontrado.' });

            const html = `
                <div style="font-family: sans-serif; padding: 20px; border: 2px solid #2c3e50; border-radius: 10px;">
                    <h1 style="color: #2c3e50; text-align: center;">Ficha de Treinamento</h1>
                    <hr/>
                    <h2 style="color: #2980b9;">${treino.nome}</h2>
                    <p><strong>Categoria:</strong> ${treino.categoria}</p>
                    <p><strong>Descrição:</strong> ${treino.descricao || 'N/A'}</p>
                    <div style="margin-top: 20px; padding: 10px; background: #eee;">
                        <strong>Aluno:</strong> ${treino.aluno.nome}
                    </div>
                </div>
            `;

            const pdfBuffer = await htmlPdf.generatePdf({ content: html }, { format: 'A4' });
            res.contentType('application/pdf');
            return res.send(pdfBuffer);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async gerarPdfGeralTreinos(req, res) {
        try {
            const treinos = await prisma.treino.findMany({ include: { aluno: true } });
            const rows = treinos.map(t => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${t.nome}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${t.categoria}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${t.aluno.nome}</td>
                </tr>
            `).join('');

            const html = `
                <h1 style="font-family: sans-serif; text-align: center;">Relatório Geral de Treinos</h1>
                <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
                    <thead style="background: #2c3e50; color: white;">
                        <tr>
                            <th style="padding: 10px; border: 1px solid #ddd;">Treino</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Categoria</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Aluno</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            `;

            const pdfBuffer = await htmlPdf.generatePdf({ content: html }, { format: 'A4' });
            res.contentType('application/pdf');
            return res.send(pdfBuffer);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }
}

const controller = new PdfController();

export const gerarPdfIndividual = (req, res) => controller.gerarPdfIndividual(req, res);
export const gerarPdfGeral = (req, res) => controller.gerarPdfGeral(req, res);
export const gerarPdfTreinoIndividual = (req, res) => controller.gerarPdfTreinoIndividual(req, res);
export const gerarPdfGeralTreinos = (req, res) => controller.gerarPdfGeralTreinos(req, res);

