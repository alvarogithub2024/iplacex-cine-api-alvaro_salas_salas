import { ObjectId } from 'mongodb';

const Actor = {
    _id: ObjectId,
    idPelicula: String,
    nombre: String,
    edad: Number,
    estaRetirado: Boolean,
    premios: Array
};

export default Actor;