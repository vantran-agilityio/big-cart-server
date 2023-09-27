// Libraries
import nodemailer from 'nodemailer';

const sendVerificationOTP = async (userEmail: string, userOTP: string) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = await nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: `Vinmart Service" <${process.env.MAIL_SERVICE}>`,
    to: userEmail,
    subject: 'Vinmart Verification Code',
    html: `<p>Hi ${userEmail},</p>
             <p>Please enter the following verification code to access your Vinmart Account.</p>
             <b>${userOTP}</b>`,
  });
};

export { sendVerificationOTP };
