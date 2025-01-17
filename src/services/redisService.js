const redis = require('redis');

// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : Utilisez des TTL (Time To Live) pour expirer les données obsolètes et éviter la surcharge de mémoire. Utilisez également des clés structurées pour une gestion plus facile.
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Utilisez des noms de clés descriptifs et structurés, par exemple, "user:1234:profile". Évitez les clés trop longues et assurez-vous qu'elles sont uniques.

// Fonctions utilitaires pour Redis
const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function cacheData(key, data, ttl) {
  return new Promise((resolve, reject) => {
    client.set(key, JSON.stringify(data), 'EX', ttl, (err, reply) => {
      if (err) {
        return reject(err);
      }
      resolve(reply);
    });
  });
}
async function getCachedData(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(reply));
    });
  });
}

async function deleteCachedData(key) {
  return new Promise((resolve, reject) => {
    client.del(key, (err, reply) => {
      if (err) {
        return reject(err);
      }
      resolve(reply);
    });
  });
}
async function getTTL(key) {
  return new Promise((resolve, reject) => {
    client.ttl(key, (err, ttl) => {
      if (err) {
        return reject(err);
      }
      resolve(ttl);
    });
  });
}
module.exports = {
  cacheData,
  getCachedData,
  deleteCachedData,
  getTTL,
};