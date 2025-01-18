const redis = require('redis');

// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : Utilisez des TTL (Time To Live) pour expirer les données obsolètes et éviter la surcharge de mémoire. Utilisez également des clés structurées pour une gestion plus facile.
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Utilisez des noms de clés descriptifs et structurés, par exemple, "user:1234:profile". Évitez les clés trop longues et assurez-vous qu'elles sont uniques.

// Fonctions utilitaires pour Redis
const client = redis.createClient();
const db = require('../config/db');

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function cacheData(key, data, ttl = 3600) {
  try {
    const client = db.getRedisClient();
    await client.set(key, JSON.stringify(data), {
      EX: ttl
    });
    return true;
  } catch (error) {
    console.error('Redis cache error:', error);
    return false;
  }
}
async function getCachedData(key) {
  try {
    const client = db.getRedisClient();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  } 
}

async function deleteCachedData(key) {
  try {
    const client = db.getRedisClient();
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
}
async function getTTL(key) {
  try {
    const client = db.getRedisClient();
    return await client.ttl(key);
  } catch (error) {
    console.error('Redis TTL error:', error);
    return -1;
  }
  
}
module.exports = {
  cacheData,
  getCachedData,
  deleteCachedData,
  getTTL,
};