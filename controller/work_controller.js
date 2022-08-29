import * as workRepository from '../data/work_data.js';
import { upload } from '../middleware/upload.js';

export async function getWorks(req, res) {
  const username = req.query.username;
  const data = await (username
    ? workRepository.getAllByUsername(username)
    : workRepository.getAll());
  res.status(200).json(data);
}
export async function createWork(req, res) {
  const { title, description, brush, image } = req.body;
  const work = await workRepository.create33(
    title,
    description,
    brush,
    image,
    req.userId
  );
  res.status(201).json(work);
}

export async function uploadImage(req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: `Image upload failed: ${req.file.originalname}` });
    }
    return res.status(200).json({
      filePath: req.file.path,
      fileName: req.file.filename,
    });
  });
}

export async function deleteWork(req, res) {
  const { id } = req.params;
  const work = await workRepository.getById(id);
  if (!work) {
    return res.status(404).json({ message: `Image not found: ${id}` });
  }
  if (work.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await workRepository.remove(id);
  res.sendStatus(204);
}
