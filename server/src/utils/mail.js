import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';
import { logger } from '../middlewares/logger.middleware.js';

const sendEmail = async ({ mailgenContent = '', to = '', subject = '' }) => {
  if (!to || !subject || !mailgenContent) {
    throw new Error('Invalid sendEmail arguments');
  }

  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Adarsh Verma',
      link: 'https://github.com/AdarshTheki/',
    },
  });

  const emailBody = mailGenerator.generate(mailgenContent); // HTML email
  const emailText = mailGenerator.generatePlaintext(mailgenContent); // plain text email

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: 'support@cartify.test',
      to,
      subject,
      text: emailText,
      html: emailBody,
    });
    logger.info(`Verification email sent to ${to}`);
  } catch (error) {
    logger.error(`Failed to send verification email: ${error.message}`);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          'To verify your email please click on the following button with in 20 minuets',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Verify your email',
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: 'We got a request to reset the password of our account',
      action: {
        instructions:
          'To reset your password click on the following button or link in 20 minuets',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Reset password',
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const orderConfirmationMailgenContent = (username, items, totalCost) => {
  return {
    body: {
      name: username,
      intro: 'Your order has been processed successfully.',
      table: {
        data: items?.map((item) => {
          return {
            item: item.product?.name,
            price: 'INR ' + item.product?.price + '/-',
            quantity: item.quantity,
          };
        }),
        columns: {
          // Optionally, customize the column widths
          customWidth: {
            item: '20%',
            price: '15%',
            quantity: '15%',
          },
          // Optionally, change column text alignment
          customAlignment: {
            price: 'right',
            quantity: 'right',
          },
        },
      },
      outro: [
        `Total order cost: INR ${totalCost}/-`,
        'You can check the status of your order and more in your order history',
      ],
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  orderConfirmationMailgenContent,
};
