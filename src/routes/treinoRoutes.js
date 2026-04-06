<<<<<<< HEAD
import express from 'express';
import * as controller from '../controllers/treinoController.js';

const router = express.Router();

router.post('/', controller.criar);
router.get('/', controller.buscarTodos);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);
=======
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

>>>>>>> 8cbc27b70f4202f0c479da8261ebc997dbca3d83

export default router;
