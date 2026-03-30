import sharp from 'sharp';
import multer from 'multer'; // mireware para lidar com uploads
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = './uploads'; // pasta para armazenar

if (!fs.existsSync(UPLOADS_DIR)) // se não existir a pasta UPLOADS_DIR
{
    fs.mkdirSync(UPLOADS_DIR); // crie a pasta
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR), // destino do arquivo - pasta criada acima
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `aluno_${req.params.id}_${Date.now()}${ext}`); // nomeando o arquivo pelo id e data
    },
});

export const upload = multer({ storage });

export async function processarFoto(filePath) {
    const processado = await sharp(fs.readFileSync(filePath))
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

    // redmencionando a foto e acertando a qualidade

    fs.writeFileSync(filePath, processado);
    return filePath.replace(/\\/g, '/'); // se vier http://localhost:300\\ troque o \\ por '/'
}

export function removerFoto(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
