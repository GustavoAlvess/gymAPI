const multer = require('multer');
const TreinoController = require('../controllers/treinoController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/catalogo/:id/foto', upload.single('foto'), TreinoController.uploadFoto);
