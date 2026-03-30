import htmlPdf from 'html-pdf-node';
import fs from 'fs';

//pdf de um aluno específico
export async function gerarPdfAluno(aluno, treino) {
    let fotoHtml = '-';

    if (treino.foto) {
        const base64 = fs.readFileSync(treino.foto).toString('base64');
        fotoHtml = `<img src="data:image/jpeg;base64, ${base64}" width="120"/>`;
    }

    const html = `
<html>
    <body>
        <h1>Relatório do Aluno</h1>
        <p>Foto: ${fotoHtml}</p>
        <p>Nome: ${aluno.nome}</p>
        <p>Email: ${aluno.email || '-'} </p>
        <p>Localidade: ${aluno.localidade || '-'} </p>
        <p>Turma: ${aluno.treino || '-'} </p>
    </body>
</html>`;

    return htmlPdf.generatePdf({ content: html }, { format: 'A4' });
}

// Pdf geral de alunos
export async function gerarPdfTodos(alunos) {
    const linhas = alunos
        .map(
            (a) => `
    <tr>
        <td>${a.nome}</td>
        <td>${a.email || '-'}</td>
        <td>${a.localidade || '-'}</td>
        <td>${a.treino || '-'} </td>
        <td>${a.treinos && a.treinos.length > 0 ? a.treinos[0].foto : '-'}</td>
    </tr>`,
        )
        .join('');

    const html = `
<h1>Relatório de alunos</h1>

<table border="1" cellspacing="0" cellspacing="8"
>
    <tr>
        <th>Nome<th>
        <th>Email<th>
        <th>Localidade<th>
        <th>Treino<th>
        <th>Foto<th>
    </tr>
    ${linhas}
</table>

<p>Total: ${alunos.length} alunos</p>`;

    return htmlPdf.generatePdf({ content: html }, { format: 'A4' });
}
