// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : Créer un module séparé pour les connexions aux bases de données permet de centraliser et de réutiliser le code de connexion, de faciliter la gestion des erreurs et des retries, et de rendre le code plus modulaire et maintenable.

// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : Pour gérer proprement la fermeture des connexions, il est important d'implémenter des fonctions de fermeture pour chaque type de connexion (MongoDB et Redis) et de les appeler lors de la fermeture de l'application (par exemple, en écoutant les événements 'SIGINT' et 'SIGTERM').
const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;
const MAX_RETRIES = 5;

async function connectMongo(retries = MAX_RETRIES) {
  while (retries) {
    try {
      mongoClient = new MongoClient(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await mongoClient.connect();
      db = mongoClient.db(config.mongoDbName);
      console.log('Connected to MongoDB');
      break;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        console.error('Could not connect to MongoDB after multiple attempts');
        throw error;
      }
      await new Promise(res => setTimeout(res, 5000)); // wait for 5 seconds before retrying
    }
  }
}

async function connectRedis(retries = MAX_RETRIES) {
  while (retries) {
    try {
      redisClient = redis.createClient({ url: config.redisUri });
      redisClient.on('error', (err) => console.error('Redis Client Error', err));
      await redisClient.connect();
      console.log('Connected to Redis');
      break;
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        console.error('Could not connect to Redis after multiple attempts');
        throw error;
      }
      await new Promise(res => setTimeout(res, 5000)); // wait for 5 seconds before retrying
    }
  }
}

function closeConnections() {
  if (mongoClient) {
    mongoClient.close();
    console.log('Closed MongoDB connection');
  }
  if (redisClient) {
    redisClient.quit();
    console.log('Closed Redis connection');
  }
}

process.on('SIGINT', closeConnections);
process.on('SIGTERM', closeConnections);

module.exports = {
  connectMongo,
  connectRedis,
  closeConnections,
  getDb: () => db,
  getRedisClient: () => redisClient,
};