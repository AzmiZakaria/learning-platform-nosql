// Question: Pourquoi créer des services séparés ?
// Réponse: La création de services séparés permet de mieux organiser le code, de le rendre plus modulaire et réutilisable. Cela facilite également les tests unitaires et l'entretien du code en isolant les différentes responsabilités dans des modules distincts.

const { ObjectId } = require('mongodb');
const db = require('../config/db');

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  try {
    const objectId = new ObjectId(id);
    const database = db.getDb();
    const result = await database.collection(collection).findOne({ _id: objectId });
    return result;
  } catch (error) {
    console.error('Error finding document by ID:', error);
    throw error;
  }
}
async function insertOne(collection, document) {
  try {
    const database = db.getDb();
    const result = await database.collection(collection).insertOne(document);
    return result;
  } catch (error) {
    console.error('Error inserting document:', error);
    throw error;
  }
}

async function updateOneById(collection, id, update) {
  try {
    const objectId = new ObjectId(id);
    const db= db.getDb();
    const result = await db.collection(collection).updateOne({ _id: objectId },{ $set: update });
    return result;
  } catch (error) {
    console.error('Error updating document by ID:', error);
    throw error;
  }
}

async function deleteOneById(collection, id) {
  try {
    const objectId = new ObjectId(id);
    const db = db.getDb();
    const result = await db.collection(collection).deleteOne({ _id: objectId });
    return result;
  } catch (error) {
    console.error('Error deleting document by ID:', error);
    throw error;
  }
}
async function findAll(collectionName, query = {}, options = {}) {
  try {
    const result = await db.getDb().collection("courses").find().toArray();
    console.log(`Found ${result.length} documents in ${collectionName}`);
    return result;
  } catch (error) {
    console.error('Error finding documents:', error);
    throw error;
  }
}
module.exports = {
  findOneById,
  insertOne,
  updateOneById,
  deleteOneById,
  findAll,
};
