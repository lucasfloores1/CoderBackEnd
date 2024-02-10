import nodemailer from 'nodemailer'

import config from '../config/config.js';

export default class EmailService {

  static #instance = null;

  constructor() {
    this.transport = nodemailer.createTransport({
      service: config.mail.service,
      port: config.mail.port,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    });
  }

  sendEmail(to, subject, html, attachments = []) {
    return this.transport.sendMail({
      from: config.mail.user,
      to,
      subject,
      html,
      attachments,
    });
  }

  static getInstance() {
    if (!EmailService.#instance) {
      EmailService.#instance = new EmailService();
    }
    return EmailService.#instance;
  }
}