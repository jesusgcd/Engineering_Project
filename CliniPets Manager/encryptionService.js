const CryptoJS = require("crypto-js");

class EncryptionService {
  constructor() {
    this.secretKey = "Security1234"; // Debe coincidir con la clave en Angular
  }

  encrypt(text) {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  decrypt(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

module.exports = EncryptionService;
