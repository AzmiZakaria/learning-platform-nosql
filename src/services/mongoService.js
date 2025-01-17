// Question: Pourquoi créer des services séparés ?
// Réponse: La création de services séparés permet de mieux organiser le code, de le rendre plus modulaire et réutilisable. Cela facilite également les tests unitaires et l'entretien du code en isolant les différentes responsabilités dans des modules distincts.

const { ObjectId } = require('mongodb');

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  try {
    const objectId = new ObjectId(id);
    const result = await collection.findOne({ _id: objectId });
    return result;
  } catch (error) {
    console.error('Error finding document by ID:', error);
    throw error;
  }
}
async function insertOne(collection, document) {
  try {
    const result = await collection.insertOne(document);
    return result;
  } catch (error) {
    console.error('Error inserting document:', error);
    throw error;
  }
}

async function updateOneById(collection, id, update) {
  try {
    const objectId = new ObjectId(id);
    const result = await collection.updateOne({ _id: objectId }, { $set: update });
    return result;
  } catch (error) {
    console.error('Error updating document by ID:', error);
    throw error;
  }
}

async function deleteOneById(collection, id) {
  try {
    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId });
    return result;
  } catch (error) {
    console.error('Error deleting document by ID:', error);
    throw error;
  }
}

module.exports = {
  findOneById,
  insertOne,
  updateOneById,
  deleteOneById,
};
