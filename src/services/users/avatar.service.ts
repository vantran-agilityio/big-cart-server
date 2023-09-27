// Libraries
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';

interface IUpdateUserAvatarParameter {
  userId: number;
  userAvatar: string;
}

interface IUpdateUserAvatarReturn {
  code: number;
  data: {};
}

const updateUserAvatar = async (
  params: IUpdateUserAvatarParameter
): Promise<IUpdateUserAvatarReturn> => {
  const userAvatar = await prisma.image.update({
    where: { userId: params.userId },
    data: { url: params.userAvatar },
  });

  return {
    code: StatusCodes.OK,
    data: { image: userAvatar.url },
  };
};

export const avatarService = {
  updateUserAvatar,
};
