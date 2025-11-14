import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('RESEND_KEY:', process.env.RESEND_KEY);

import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_KEY);

async function sendEmail(to, subject, html) {
  try {
    const data = await resend.emails.send({
      from: 'siccafelipe.dev@gmail.com',
      to,
      subject,
      html,
    });
    console.log('Email enviado:', data);
  } catch (error) {
    console.error('Error enviando email:', error);
  }
}

export {sendEmail}