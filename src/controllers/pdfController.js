const { prisma } = require('../utils/prisma');
const htmlPdf = require('html-pdf-node');
const fs = require('fs');
const path = require('path');

class PdfController {

    async gerarPdfIndividual(req, res) {
        try {
            const { id } = req.params;
            const treino = await prisma.treino.findUnique({ where: { id: Number(id) } });

            if (!treino) return res.status(404).json({ erro: 'Treino não encontrado.' });

            let fotoBase64 = '';
            if (treino.foto && fs.existsSync(treino.foto)) {
                const imagem = fs.readFileSync(treino.foto);
                fotoBase64 = `data:image/jpeg;base64,${imagem.toString('base64')}`;
            }

            const html = `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1 style="color: #2c3e50;">Ficha Técnica do Treino</h1>
                    <hr/>
                    ${
                        fotoBase64
                            ? `<img src="${fotoBase64}" style="width: 300px; border-radius: 10px;"/>`
                            : '<p>Sem foto</p>'
                    }
                    <p><strong>Nome:</strong> ${treino.nome}</p>
                    <p><strong>Categoria:</strong> ${treino.categoria}</p>
                    <p><strong>Preço:</strong> R$ ${treino.preco.toFixed(2)}</p>
                    <p><strong>Status:</strong> ${treino.disponivel ? 'Ativo' : 'Inativo'}</p>
                    <p><strong>Descrição:</strong> ${treino.descricao || 'Nenhuma'}</p>
                </div>
            `;

            const file = { content: html };
            const pdfBuffer = await htmlPdf.generatePdf(file, { format: 'A4' });

            res.contentType('application/pdf');
            return res.send(pdfBuffer);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao gerar PDF.' });
        }
    }

    async gerarPdfGeral(req, res) {
        try {
            const treinos = await prisma.treino.findMany();

            const rows = treinos
                .map(
                    (t) => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${t.nome}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${t.categoria}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">R$ ${t.preco.toFixed(2)}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                        t.disponivel ? 'Sim' : 'Não'
                    }</td>
                </tr>
            `,
                )
                .join('');

            const html = `
                <h1 style="text-align: center;">Relatório Geral de Treinos - Academia</h1>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Nome</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Categoria</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Preço</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Disponível</th>
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
            return res.status(500).json({ erro: 'Erro ao gerar relatório geral.' });
            
        }
    }
}

module.exports = new PdfController();
