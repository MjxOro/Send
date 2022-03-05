import createAndUpload from '../utils/createAndUpload';
import express, { Request, Response } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import User from '../models/User';

const router = express.Router();

// Recieve MultiPart media/files middleware
/*
 * Multiple upload calls may run out of multer memoryStorage
 */
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  '/roomPhoto',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const { fileName } = req.body;
      if (req.file) {
        const mimeType = req.file.mimetype;
        const file = Readable.from(req.file.buffer);
        const link = await createAndUpload({ file, fileName, mimeType });
        return res.status(201).send(link);
      }
      return res
        .status(201)
        .send(
          `https://ui-avatars.com/api/?name=${fileName.split(' ').join('+')}`
        );
    } catch (e) {
      console.log(e);
      return res.sendStatus(403);
      //handle Error
    }
  }
);
router.put(
  '/userUpdate/:id',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const name = req.body.newName;
      const userId = req.params.id;
      if (req.file) {
        const fileName = req.file.filename;
        const mimeType = req.file.mimetype;
        const file = Readable.from(req.file.buffer);
        const link = await createAndUpload({ file, fileName, mimeType });
        if (name) {
          const updateUser: any = await User.findOneAndUpdate(
            { _id: userId },
            {
              name: name,
              avatar: link
            }
          );
          await updateUser.save();
        } else {
          const updateUser: any = await User.findOneAndUpdate(
            { _id: userId },
            {
              avatar: link
            }
          );
          await updateUser.save();
        }
        return res.status(201).send(link);
      } else {
        const updateUser: any = await User.findOneAndUpdate(
          { _id: userId },
          {
            name: name
          }
        );
        await updateUser.save();
        return res.status(201).send('saved');
      }
    } catch (e) {
      console.log(e);
      return res.sendStatus(403);
    }
  }
);

export default router;
