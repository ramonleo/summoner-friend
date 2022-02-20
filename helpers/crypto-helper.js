const CryptoJS = require("crypto-js");

module.exports = {
    AESEncrypt: function (pureText) {    
        const privateKey=`secret key 123`;    
        var ciphertext = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(pureText), privateKey).toString());    
        return ciphertext;
    },

    AESDecrypt: function (encryptedText) {  
        const privateKey=`secret key 123`;    
        var bytes  = CryptoJS.AES.decrypt(decodeURIComponent(encryptedText), privateKey);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));    
        return decryptedData;
    }
}