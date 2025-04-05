const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const crypto = require("crypto"); // Para generar tokens seguros
const nodemailer = require("nodemailer"); // Importar Nodemailer
const EncryptionService = require("./encryptionService"); // Importar servicio de encriptación
const encryptionService = new EncryptionService();


// Inicializa Firebase Admin SDK
const serviceAccount = require("./proyectosoftware-1d017-firebase-adminsdk-eczb0-73af7d9747.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para eliminar usuario de Firebase Auth y Firestore
app.delete("/deleteUserAndFirestore", async (req, res) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).send({ error: "Se requiere un UID." });
  }

  try {
    // Eliminar de Firestore
    await admin.firestore().collection("Usuarios").doc(uid).delete();

    // Eliminar de Firebase Auth
    await admin.auth().deleteUser(uid);

    res.send({ success: true, message: "Usuario eliminado de Auth y Firestore con éxito." });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

// Ruta para actualizar el correo electrónico de un usuario
app.patch("/updateEmail", async (req, res) => {
  const { uid, email } = req.body;

  console.log("Datos recibidos:", { uid, email });

  if (!uid || !email) {
    console.log("Error: Faltan UID o correo.");
    return res.status(400).send({ error: "Se requieren UID y correo." });
  }

  try {
    console.log("Buscando usuario en Firebase Auth...");
    const user = await admin.auth().getUser(uid);
    console.log("Usuario encontrado:", user.email);

    console.log("Actualizando correo en Firebase Auth...");
    await admin.auth().updateUser(uid, { email });

    console.log("Actualizando correo en Firestore...");
    await admin.firestore().collection("Usuarios").doc(uid).update({ correo: email });

    console.log("Correo actualizado con éxito.");
    //res.send({ success: true, message: "Correo actualizado en Auth y Firestore con éxito." });
  } catch (error) {
    console.error("Error al actualizar el correo:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});



app.patch("/updatePassword", async (req, res) => {
  const { uid, password } = req.body;

  console.log("Datos recibidos en /updatePassword:", { uid, password });

  if (!uid || !password) {
    return res.status(400).send({ error: "Se requieren UID y contraseña." });
  }

  try {
    console.log("Entrando al bloque try, actualizando contraseña...");
    // Actualizar contraseña en Firestore
    await admin.firestore().collection("Usuarios").doc(uid).update({ password });
    // Actualizar contraseña en Firebase Auth
    await admin.auth().updateUser(uid, { password });

    console.log("Contraseña actualizada en Firebase Auth y Firestore.");
    res.send({ success: true, message: "Contraseña actualizada con éxito en Auth y Firestore." });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});


app.post("/requestPasswordReset", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ error: "Correo requerido" });

  try {
    const usersRef = admin.firestore().collection("Usuarios");
    const snapshot = await usersRef.where("correo", "==", email).get();

    if (snapshot.empty) return res.status(404).send({ error: "Correo no registrado" });

    const userDoc = snapshot.docs[0];
    const uid = userDoc.id;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 15 * 60 * 1000;

    await userDoc.ref.update({ resetToken, expiresAt });

    // Enlace de recuperación
    const resetLink = `http://localhost:4200/reset-password-confirm?token=${resetToken}`;

    // Enviar correo
    const emailResponse = await enviarCorreo(
      email,
      "Restablecimiento de contraseña - CliniPets",
      `Hemos recibido una solicitud para restablecer tu contraseña.

      Para continuar, haz clic en el siguiente enlace:

      ${resetLink}

      Si no solicitaste este cambio, puedes ignorar este mensaje.`
    );

    res.send(emailResponse);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.post("/resetPassword", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).send({ error: "Token y nueva contraseña requeridos" });
  }

  try {
    // Buscar el usuario con el token
    const usersRef = admin.firestore().collection("Usuarios");
    const snapshot = await usersRef.where("resetToken", "==", token).get();

    if (snapshot.empty) {
      return res.status(400).send({ error: "Token inválido o expirado" });
    }

    // Obtener el documento del usuario
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const expiresAt = userData.expiresAt;
    const uid = userDoc.id; // Obtener el UID desde el identificador del documento

    // Verificar si el token sigue siendo válido
    if (Date.now() > expiresAt) {
      return res.status(400).send({ error: "El token ha expirado." });
    }

    // **Paso 1: Actualizar la contraseña en Firebase Auth**
    await admin.auth().updateUser(uid, { password: newPassword });

    // **Paso 2: Encriptar la nueva contraseña**
    const encryptedPassword = encryptionService.encrypt(newPassword);

    // **Paso 3: Actualizar la contraseña en Firestore**
    await userDoc.ref.update({
      password: encryptedPassword,
      resetToken: null,
      expiresAt: null
    });

    res.send({ success: true, message: "Contraseña restablecida y actualizada en Firestore con éxito." });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    res.status(500).send({ error: error.message });
  }
});


// Configurar transporte SMTP con Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "restauracionclaveclinicpets@gmail.com", // Tu nuevo correo
    pass: "bclydkwvqxixdrzc", // NO uses la contraseña normal, usa la App Password
  },
});

// Función para enviar correos
async function enviarCorreo(destinatario, asunto, mensaje) {
  console.log("📨 Intentando enviar correo a:", destinatario);

  const mailOptions = {
    from: '"CliniPets Soporte" <restauracionclaveclinicpets@gmail.com>',
    to: destinatario,
    subject: asunto,
    text: mensaje,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado con éxito:", info);
    return { success: true, message: "Correo enviado con éxito." };
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    return { success: false, error: error.message };
  }
}

// Servidor corriendo
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
