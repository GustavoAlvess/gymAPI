import  prisma  from '../utils/prismaClient.js';
import htmlPdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';

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

            const nomesTreinos = aluno.treinos && aluno.treinos.length > 0 
                ? aluno.treinos.map(t => t.nome).join(', ') 
                : 'Nenhum treino vinculado';

            const html = `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1 style="color: #2c3e50;">Ficha Técnica do Aluno</h1>
                    <hr/>
                    ${fotoBase64 ? `<img src="${fotoBase64}" style="width: 250px; border-radius: 10px; margin-bottom: 20px;"/>` : '<p><em>Sem foto cadastrada</em></p>'}
                    
                    <p><strong>Nome:</strong> ${aluno.nome}</p>
                    <p><strong>Email:</strong> ${aluno.email || 'Não informado'}</p>
                    <p><strong>Localidade:</strong> ${aluno.localidade || 'Não informada'}</p>
                    <p><strong>Status:</strong> ${aluno.ativo ? 'Ativo' : 'Inativo'}</p>
                    <hr/>
                    <h3 style="color: #2c3e50;">Treinos</h3>
                    <p>${nomesTreinos}</p>
                </div>
            `;

            const file = { content: html };
            const pdfBuffer = await htmlPdf.generatePdf(file, { format: 'A4' });

            res.contentType('application/pdf');
            return res.send(pdfBuffer);
        } catch (error) {
            return res.status(500).json({ erro: error.message || 'Erro ao gerar PDF individual.' });
        }
}

    async gerarPdfGeral(req, res) {
        try {
            const alunos = await prisma.aluno.findMany({
                include: {
                    treinos: true
                }
            });
           const rows = alunos.map((a) => {
        const nomesTreinos = a.treinos && a.treinos.length > 0 
        ? a.treinos.map(t => t.nome).join(', ') 
        : 'Nenhum treino';

        return `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${a.nome}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${a.email || 'Não informado'}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${nomesTreinos}</td>
        </tr>
    `;
    }).join('');

            const html = `
                <h1 style="text-align: center;">Relatório Geral de alunos</h1>
                <table style="width: 100%; border-collapse: collapse;">
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

            const file = { content: html };
            const pdfBuffer = await htmlPdf.generatePdf(file, { format: 'A4' });

            res.contentType('application/pdf');
            return res.send(pdfBuffer);
        } catch (error) {
            return res.status(400).json({ erro:  error.message || 'Erro ao gerar relatório geral.' });
        }
    }
}

const controller = new PdfController();
export const gerarPdfIndividual = (req, res) => controller.gerarPdfIndividual(req, res);
export const gerarPdfGeral = (req, res) => controller.gerarPdfGeral(req, res);