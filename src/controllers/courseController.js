// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Un contrôleur gère la logique métier et les interactions avec les services et les bases de données, tandis qu'une route définit les points d'entrée de l'API et délègue les requêtes aux contrôleurs.
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : Séparer la logique métier des routes permet de rendre le code plus modulaire, maintenable et testable. Cela facilite également la réutilisation de la logique métier dans différentes parties de l'application.

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  try {
    const course = await mongoService.insertOne('courses', req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).send('Error creating course');
  }
}
async function getCourse(req, res) {
  const courseId = req.params.id;
  if (!ObjectId.isValid(courseId)) {
    return res.status(400).send('Invalid course ID');
  }

  const course = await mongoService.findOneById('courses', { _id: new ObjectId(courseId) });
  if (!course) {
    return res.status(404).send('Course not found');
  }

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

module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse
};