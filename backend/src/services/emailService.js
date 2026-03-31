import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendContactEmail = async (contactData) => {
  try {
    const { name, email, phone, message } = contactData;

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL_RECIPIENT,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your message!',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        <p>Best regards,<br>Leelaprasad</p>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

export default { sendContactEmail };
