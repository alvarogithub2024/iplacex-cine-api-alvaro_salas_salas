import { ObjectId } from 'mongodb'
import { client } from '../common/db.js'
import Actor from './actor.js'

const actorCollection = client.db("cine-db").collection("actores")
const peliculaCollection = client.db("cine-db").collection("peliculas")

async function handleInsertActorRequest(req, res) {
    const nombrePelicula = req.body.nombrePelicula

    await peliculaCollection.findOne({ nombre: nombrePelicula })
    .then(async (pelicula) => {
        if (!pelicula) return res.status(404).send({ message: "La película especificada no existe" })

        const nuevoActor = { ...Actor }
        nuevoActor.idPelicula = pelicula._id.toString()
        nuevoActor.nombre = req.body.nombre
        nuevoActor.edad = req.body.edad
        nuevoActor.estaRetirado = req.body.estaRetirado
        nuevoActor.premios = req.body.premios || []

        await actorCollection.insertOne(nuevoActor)
        .then((result) => {
            if (!result.acknowledged) return res.status(500).send({ message: "Error al crear el actor" })

            return res.status(201).send({ 
                message: "Actor creado correctamente", 
                id: result.insertedId 
            })
        })
        .catch((e) => {
            return res.status(500).send({ message: "Error al insertar actor", code: e.message })
        })
    })
    .catch((e) => {
        return res.status(500).send({ message: "Error al buscar película", code: e.message })
    })
}

async function handleGetActoresRequest(req, res) {
    await actorCollection.find({}).toArray()
    .then((actores) => {
        return res.status(200).send(actores)
    })
    .catch((e) => {
        return res.status(500).send({ message: "Error al obtener los actores", code: e.message })
    })
}

async function handleGetActorByIdRequest(req, res) {
    let id = req.params.id

    try {
        let oid = ObjectId.createFromHexString(id)

        await actorCollection.findOne({ _id: oid })
        .then((actor) => {
            if (!actor) return res.status(404).send({ message: "Actor no encontrado" })

            return res.status(200).send(actor)
        })
        .catch((e) => {
            return res.status(500).send({ message: "Error al obtener el actor", code: e.message })
        })
    } catch (e) {
        return res.status(400).send({ message: "ID mal formado" })
    }
}

async function handleGetActoresByPeliculaIdRequest(req, res) {
    let idPelicula = req.params.pelicula

    try {
        let oid = ObjectId.createFromHexString(idPelicula)

        await peliculaCollection.findOne({ _id: oid })
        .then(async (pelicula) => {
            if (!pelicula) return res.status(404).send({ message: "Película no encontrada" })

            await actorCollection.find({ idPelicula: idPelicula }).toArray()
            .then((actores) => {
                return res.status(200).send(actores)
            })
            .catch((e) => {
                return res.status(500).send({ message: "Error al obtener actores", code: e.message })
            })
        })
        .catch((e) => {
            return res.status(500).send({ message: "Error al buscar película", code: e.message })
        })
    } catch (e) {
        return res.status(400).send({ message: "ID de película mal formado" })
    }
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
}