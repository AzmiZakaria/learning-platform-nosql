// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Un contrôleur gère la logique métier et les interactions avec les services et les bases de données, tandis qu'une route définit les points d'entrée de l'API et délègue les requêtes aux contrôleurs.
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : Séparer la logique métier des routes permet de rendre le code plus modulaire, maintenable et testable. Cela facilite également la réutilisation de la logique métier dans différentes parties de l'application.

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');
const CACHE_PREFIX = 'course';
const CACHE_TTL = 3600;

async function createCourse(req, res) {
  try {
    const course = await mongoService.insertOne('courses', req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).send('Error creating course');
  }
}
async function getCourse(req, res) {
  const cacheKey = `${CACHE_PREFIX}:${req.params.id}`;
  const cache = await redisService.getCachedData(cacheKey);
  if (cache){
      res.status(200).json(cache);
      return;
  }
  const courseId = req.params.id;
  if (!ObjectId.isValid(courseId)) {
    return res.status(400).send('Invalid course ID');
  }

  const course = await mongoService.findOneById('courses', { _id: new ObjectId(courseId) });
  if (!course) {
    return res.status(404).send('Course not found');
  }
  await redisService.cacheData(cacheKey, course, CACHE_TTL);

  res.status(200).json(course);
}

async function updateCourse(req, res) {
  const courseId = req.params.id;
  if (!ObjectId.isValid(courseId)) {
    return res.status(400).send('Invalid course ID');
  }

  const updatedCourse = await mongoService.updateOne('courses', { _id: new ObjectId(courseId) }, { $set: req.body });
  if (!updatedCourse) {
    return res.status(404).send('Course not found');
  }

  res.status(200).json(updatedCourse);
}

async function deleteCourse(req, res) {
  const courseId = req.params.id;
  if (!ObjectId.isValid(courseId)) {
    return res.status(400).send('Invalid course ID');
  }

  const deletedCourse = await mongoService.deleteOne('courses', { _id: new ObjectId(courseId) });
  if (!deletedCourse) {
    return res.status(404).send('Course not found');
  }

  res.status(200).send('Course deleted');
}
async function getCourses(req, res) {
  try {
    const cache = await redisService.getCachedData(`${CACHE_PREFIX}:all`);
    if (cache){
        res.status(200).json(cache);
        console.log('Cache hit');
        return;
    }
    const courses = await mongoService.findAll('courses');
    const work=await redisService.cacheData(`${CACHE_PREFIX}:all`, courses, CACHE_TTL);
    if(!work){
        console.log('Error caching data');
    }
    else{
        console.log('Data cached');
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
}

module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getCourses,
};