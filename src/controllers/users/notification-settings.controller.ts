// Libraries
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

// Model
import { User } from '@prisma/client';

// Service
import { notificationSettingsService } from 'src/services/users';

const updateUserNotificationSettings = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const result =
      await notificationSettingsService.updateUserNotificationSettings({
        userId: (req.user as User).id,
        enableEmailNotification: Boolean(req.body.enableEmailNotification),
        enableOrderNotification: Boolean(req.body.enableOrderNotification),
        enableGeneralNotification: Boolean(req.body.enableGeneralNotification),
      });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

export const notificationSettingsController = {
  updateUserNotificationSettings,
};
