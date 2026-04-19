const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    tipo: {
        type: String,
        enum: ['ingreso', 'gasto'],
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaccion', transaccionSchema);