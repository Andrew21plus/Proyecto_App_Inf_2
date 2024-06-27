const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andrew21plus@gmail.com',
    pass: 'kkum klmg iazi ivle',
  },
});

const sendPasswordResetEmail = async (email, tempPassword) => {
  const mailOptions = {
    from: 'andrew21plus@gmail.com',
    to: email,
    subject: 'Restablecimiento de contraseña',
    text: `Tu nueva contraseña temporal es: ${tempPassword}. Por favor, cámbiala después de iniciar sesión.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('Error al enviar el correo');
  }
};

module.exports = {
  sendPasswordResetEmail,
};

