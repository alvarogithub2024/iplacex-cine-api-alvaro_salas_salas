import express, { urlencoded } from 'express'
import cors from 'cors'

import { client, testConnection } from './src/common/db.js'
import actorRoutes from './src/actor/routes.js'
import peliculaRoutes from './src/pelicula/routes.js'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
    let message = 'Bienvenido al cine Iplacex'
    return res.status(200).send(message)
})

app.use('/api', actorRoutes)
app.use('/api', peliculaRoutes)

try {
    await client.connect()
    console.log('Conectado a MongoDB Atlas')
  
    const adminDb = client.db("admin")
    await adminDb.command({ ping: 1 })
    console.log("Ping a la base de datos exitoso")
 
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
} catch (e) {
    console.error('Error al conectar con la base de datos:', e)
    process.exit(1) 
}