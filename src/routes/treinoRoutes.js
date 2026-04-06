import { Router } from 'express';
import multer from 'multer';
import * as TreinoController from '../controllers/treinoController.js';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/catalogo', TreinoController.buscarTodos);

router.get('/catalogo/:id', TreinoController.buscarPorId);

router.post('/catalogo', TreinoController.criar);

router.put('/catalogo/:id', TreinoController.atualizar);

router.delete('/catalogo/:id', TreinoController.deletar);

router.post('/catalogo/:id/foto', upload.single('foto'), TreinoController.uploadFoto);


export default router;
