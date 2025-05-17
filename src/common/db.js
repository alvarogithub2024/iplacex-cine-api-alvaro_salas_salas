import { MongoClient } from 'mongodb';

const password = "xIAic3Ww2mh0wNkE"; 
const uri = `mongodb+srv://alvarofersalas:${password}@eva-u3-express.jncx7j0.mongodb.net/?retryWrites=true&w=majority&appName=eva-u3-express`;

export const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000, 
  connectTimeoutMS: 10000, 
});

export async function testConnection() {
  try {
    await client.connect();
    console.log("Conexión a MongoDB Atlas establecida correctamente");
    return true;
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    return false;
  }
}