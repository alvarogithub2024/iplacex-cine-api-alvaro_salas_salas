import { ObjectId } from 'mongodb'
import { client } from '../common/db.js'
import Pelicula from './pelicula.js'

const peliculaCollection = client.db("cine-db").collection("peliculas")

async function handleInsertPeliculaRequest(req, res) {
    let data = req.body

    let nuevaPelicula = { ...Pelicula }
    nuevaPelicula.nombre = data.nombre
    nuevaPelicula.generos = data.generos
    nuevaPelicula.anioEstreno = data.anioEstreno

    await peliculaCollection.insertOne(nuevaPelicula)
    .then((result) => {
        if (!result.acknowledged) return res.status(500).send({ message: "Error al crear la película" })

        return res.status(201).send({ 
            message: "Película creada correctamente", 
            id: result.insertedId 
        })
    })
    .catch((e) => {
        return res.status(500).send({ message: "Error al procesar la solicitud", code: e.message })
    })
}

async function handleGetPeliculasRequest(req, res) {
    await peliculaCollection.find({}).toArray()
    .then((peliculas) => {
        return res.status(200).send(peliculas)
    })
    .catch((e) => {
        return res.status(500).send({ message: "Error al obtener las películas", code: e.message })
    })
}

async function handleGetPeliculaByIdRequest(req, res) {
    let id = req.params.id

    try {
        let oid = ObjectId.createFromHexString(id)

        await peliculaCollection.findOne({ _id: oid })
        .then((p) => {
            if (p === null) return res.status(404).send({ message: "Película no encontrada" })

            return res.status(200).send(p)
        })
        .catch((e) => {
            return res.status(500).send({ message: "Error al obtener la película", code: e.message })
        })

    } catch (e) {
        return res.status(400).send({ message: "ID mal formado" })
    }
}

async function handleUpdatePeliculaByIdRequest(req, res) {
    let id = req.params.id

    try {
        let oid = ObjectId.createFromHexString(id)
        let data = req.body

        let actualizacion = { $set: {
            nombre: data.nombre,
            generos: data.generos,
            anioEstreno: data.anioEstreno
        }}

        await peliculaCollection.updateOne({ _id: oid }, actualizacion)
        .then((r) => {
            if (r.matchedCount === 0) return res.status(404).send({ message: "Película no encontrada" })

            return res.status(200).send({ message: "Película actualizada correctamente" })
        })
        .catch((e) => {
            return res.status(500).send({ message: "Error al actualizar la película", code: e.message })
        })

    } catch (e) {
        return res.status(400).send({ message: "ID mal formado" })
    }
}

async function handleDeletePeliculaByIdRequest(req, res) {
    let id = req.params.id

    try {
        let oid = ObjectId.createFromHexString(id)

        await peliculaCollection.deleteOne({ _id: oid })
        .then((r) => {
            if (r.deletedCount === 0) return res.status(404).send({ message: "Película no encontrada" })

            return res.status(200).send({ message: "Película eliminada correctamente" })
        })
        .catch((e) => {
            return res.status(500).send({ message: "Error al eliminar la película", code: e.message })
        })

    } catch (e) {
        return res.status(400).send({ message: "ID mal formado" })
    }
}

export default {
    handleInsertPeliculaRequest,
    handleGetPeliculasRequest,
    handleGetPeliculaByIdRequest,
    handleUpdatePeliculaByIdRequest,
    handleDeletePeliculaByIdRequest
}