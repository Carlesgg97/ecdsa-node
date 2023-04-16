const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, hexToBytes, toHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const crypto = require("crypto");

const MAX_RAND = 281474976710655;

const [privateKey, destinationAddress, amount] = process.argv.slice(2);

// Signatures are created via privateKey+destinationAddress+amount+randomId
// This is so that in case the signature is intercepted, the transaction is not replayable.

const randomTxId = crypto.randomInt(0, MAX_RAND);

const message = `${destinationAddress}|${amount}|${randomTxId}`;
console.log(`Message: ${message}`)
const messageHash = hashMessage(message);
console.log(`MessageHash: 0x${toHex(messageHash)}`)

// sign message
const signature = secp256k1.sign(messageHash, hexToBytes(privateKey));
console.log(`Signed message: 0x${signature.toCompactHex()}`)
console.log(`Signature recovery bit: ${signature.recovery}`)

// Verification
console.log(`Recovered public key: 0x${signature.recoverPublicKey(messageHash).toHex()}`);


function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}