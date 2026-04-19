const express = require('express');
const Transaccion = require('../models/transaccion');
const router = express.Router();

// Obtener todas las transacciones
router.get('/', async (req, res) => {
    try {
        const transacciones = await Transaccion.find();
        res.json(transacciones);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crear una nueva transacción
router.post('/', async (req, res) => {
    try {
        const nuevaTransaccion = new Transaccion({
            monto: req.body.monto,
            tipo: req.body.tipo,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria
        });
        const transaccionGuardada = await nuevaTransaccion.save();
        res.status(201).json(transaccionGuardada);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const transaccionActualizada = await Transaccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaccionActualizada) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        res.json(transaccionActualizada);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const transaccionEliminada = await Transaccion.findByIdAndDelete(req.params.id);
        if (!transaccionEliminada) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        res.json({ message: 'Transacción eliminada' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;



