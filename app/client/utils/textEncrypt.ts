import CryptoJS from 'crypto-js'

// 配置参数
const key = CryptoJS.enc.Utf8.parse("LrbLutiqz284z1d2");
const iv = CryptoJS.enc.Utf8.parse("zNdkwnkFrXvYVcCb");

// 判断是否为普通对象
function isPlainObject(value) {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
    );
}

// 加密函数
export function aesEncrypt(plainText) {
    if (isPlainObject(plainText)) {
        plainText = JSON.stringify(plainText);
    }
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString(); // 默认 base64 输出
}

// 解密函数
export function aesDecrypt(cipherText) {
    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const str = decrypted.toString(CryptoJS.enc.Utf8);
    try {
        return JSON.parse(str);
    }catch(err) {
        return str;
    }
}
