import * as workRepository from '../data/work_data.js';
import { upload } from '../middleware/upload.js';

export async function getWorks(req, res) {
  const { limit, offset, username } = req.query;
  const limitInt = parseInt(limit);
  const offsetInt = parseInt(offset);
  const data = await (username
    ? workRepository.getAllByUsername(username, limitInt, offsetInt)
    : workRepository.getAll(limitInt, offsetInt));
  res.status(200).json(data);
}

export async function showWorks(req, res) {
  const { limit, offset } = req.query;
  const limitInt = parseInt(limit);
  const offsetInt = parseInt(offset);
  const data = await workRepository.getAll(limitInt, offsetInt);
  res.status(200).json(data);
}

export async function searchWorks(req, res) {
  const { limit, offset, searchTerm } = req.query;
  const limitInt = parseInt(limit);
  const offsetInt = parseInt(offset);
  const data = await workRepository.getAllBySearch(
    limitInt,
    offsetInt,
    searchTerm
  );
  res.status(200).json(data);
}

export async function createWork(req, res) {
  const { title, description, brush, originalName, fileName } = req.body;
  const work = await workRepository.create(
    title,
    description,
    brush,
    originalName,
    fileName,
    req.userId
  );
  res.status(201).json(work);
}

export async function uploadImage(req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', err });
    }
    return res.status(200).json({
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
      originalName: res.req.file.originalname,
    });
  });
}

export async function deleteWork(req, res) {
  const { id } = req.params;
  const data = await workRepository.getById(id);
  if (!data) {
    return res.status(404).json({ message: `Image not found: ${id}` });
  }
  if (data.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await workRepository.remove(id);
  res.sendStatus(204);
}
