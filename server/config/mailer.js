const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.MAIL_FROM || "Recouvra+ <noreply@recouvraplus.com>",
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${process.env.APP_URL || "http://localhost:5000"}/reset-password?token=${resetToken}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 40px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 8px 0 0; opacity: 0.85; }
        .body { padding: 40px; }
        .body h2 { color: #1e3a5f; margin-top: 0; }
        .body p { color: #555; line-height: 1.6; }
        .btn { display: inline-block; background: linear-gradient(135deg, #1e3a5f, #2563eb); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; font-size: 16px; }
        .warning { background: #fff3cd; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; color: #92400e; font-size: 14px; margin-top: 20px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Recouvra+</h1>
          <p>Réinitialisation de mot de passe</p>
        </div>
        <div class="body">
          <h2>Bonjour ${userName || ""},</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe</a>
          </div>
          <div class="warning">
            ⏱️ Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </div>
          <p style="margin-top:20px; font-size:13px; color:#9ca3af;">Si le bouton ne fonctionne pas, copiez ce lien : <br><a href="${resetUrl}" style="color:#2563eb;">${resetUrl}</a></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Recouvra+ — Tous droits réservés
        </div>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to: email, subject: "🔐 Réinitialisation de mot de passe - Recouvra+", html });
};

module.exports = { sendMail, sendPasswordResetEmail };