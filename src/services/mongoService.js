// Question: Pourquoi créer des services séparés ?
// Réponse: La création de services séparés permet de mieux organiser le code, de le rendre plus modulaire et réutilisable. Cela facilite également les tests unitaires et l'entretien du code en isolant les différentes responsabilités dans des modules distincts.

const { ObjectId } = require('mongodb');

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  try {
    const objectId = new ObjectId();
    const result = await collection.findOne({ _id: objectId });
    return result;
  } catch (error) {
    console.error('Error finding document by ID:', error);
    throw error;
  }
}

// Export des services
module.exports = {
  findOneById,
};