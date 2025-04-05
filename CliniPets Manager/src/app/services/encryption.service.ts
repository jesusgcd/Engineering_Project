import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey = 'Security1234';

  constructor() {}

  // Método para cifrar texto
  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  // Método para descifrar texto
  decrypt(cipherText: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
