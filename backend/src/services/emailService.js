// Legacy SMTP contact email flow has been retired.
// Public submissions now go through Formspree.

export const sendContactEmail = async () => {
  return {
    success: false,
    message: 'Legacy backend email flow is disabled. Use Formspree for contact submissions.',
  };
};

export default { sendContactEmail };
