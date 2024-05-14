import nodemailer, { SendMailOptions } from "nodemailer";
import { SMTP_CRED } from "../config/index";
import log from "./logger";

async function createTestCreds() {
  const creds = await nodemailer.createTestAccount();
  console.log({ creds });
}

createTestCreds();


const smtp = SMTP_CRED;  

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: smtp.secure,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, "Error sending email");
      return;
    }

    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;