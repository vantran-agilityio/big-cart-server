// Libraries
import { StatusCodes } from 'http-status-codes';
import prisma from 'src/prisma';

// Helpers
import { sendVerificationOTP } from 'src/helpers/authentication';

// Utils
import { generateOTP } from 'src/utils/generateOTP.util';
import { generateHash } from 'src/utils/generateHash.util';

interface IResendActivateOTPParameter {
  id: number;
  email: string;
}

interface ICreateServiceReturn {
  code: number;
  data: { msg?: string };
}

const resendActivateOTP = async (
  params: IResendActivateOTPParameter
): Promise<ICreateServiceReturn> => {
  const OTP: string = generateOTP();
  const { hash } = generateHash(OTP);

  await prisma.userOTP.upsert({
    where: { userId: params.id },
    update: { otp: hash },
    create: { userId: params.id, otp: hash },
  });

  await sendVerificationOTP(params.email, OTP);

  return {
    code: StatusCodes.OK,
    data: {},
  };
};

export const resendActivateOTPService = {
  resendActivateOTP,
};
