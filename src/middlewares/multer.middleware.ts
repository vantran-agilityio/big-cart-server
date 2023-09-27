import multer from 'multer';
import fs from 'fs';

// Model
import { User } from '@prisma/client';

const updateUserAvatar = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Defined path to save the file
      const targetDir = `public/images/avatars`;

      if (req.params.userId === `${(req.user as User).id}`) {
        // Check if the directory exists if not create it
        fs.mkdirSync(targetDir, { recursive: true });
        cb(null, targetDir);
      }
    },
    filename: (req, file, cb) => {
      // Create file name by using user id
      cb(null, `${(req.user as User).id}.png`);
    },
  }),
}).single('image');

export const multerUploader = { updateUserAvatar };
