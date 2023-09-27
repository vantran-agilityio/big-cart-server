// Libraries
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';

interface IUpdateUserNotificationSettingsParameter {
  userId: number;
  enableEmailNotification: boolean;
  enableOrderNotification: boolean;
  enableGeneralNotification: boolean;
}

interface IUpdateUserNotificationSettingsReturn {
  code: number;
  data: {};
}

const updateUserNotificationSettings = async (
  params: IUpdateUserNotificationSettingsParameter
): Promise<IUpdateUserNotificationSettingsReturn> => {
  const newUserSetting = await prisma.userSetting.update({
    where: { id: params.userId },
    data: {
      enableEmailNotification: params.enableEmailNotification,
      enableOrderNotification: params.enableOrderNotification,
      enableGeneralNotification: params.enableGeneralNotification,
    },
  });

  return {
    code: StatusCodes.OK,
    data: {
      enableEmailNotification: newUserSetting.enableEmailNotification,
      enableOrderNotification: newUserSetting.enableOrderNotification,
      enableGeneralNotification: newUserSetting.enableGeneralNotification,
    },
  };
};

export const notificationSettingsService = {
  updateUserNotificationSettings,
};
