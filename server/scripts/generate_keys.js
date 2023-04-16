const { secp256k1 } = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);
const publicAddress = keccak256(publicKey).slice(12);

console.log(`Private key: 0x${toHex(privateKey)}`);
console.log(`Public key: 0x${toHex(publicKey)}`);
console.log(`Address: 0x${toHex(publicAddress)}`)
