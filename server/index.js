const express = require("express");
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");


const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
  "0x32e3296c0c845b75c57168ea3053728de7163faf": 2500
};

const executedTransactions = {};

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

function recoverMessagePublicKey(message, messageSignature, recoveryBit) {
  console.log(`recovering public key from message: ${message}, sig: ${messageSignature}`)
  const sig = secp256k1.Signature.fromCompact(messageSignature.slice(2)).addRecoveryBit(recoveryBit);
  console.log("With recovery bit:", sig.recovery)
  const messageHash = hashMessage(message);
  console.log(`Recovering from messageHash: 0x${toHex(messageHash)}`);
  console.log(`Using sig: 0x${sig.toCompactHex()}`);
  return sig.recoverPublicKey(messageHash);
}

function addressFromPubKey(pubKey) {
  const bytes = pubKey.toRawBytes();
  return keccak256(bytes.slice(1)).slice(12);
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, txId, txSignature, txRecoveryBit } = req.body;

  if (executedTransactions.hasOwnProperty(txId)) {
    res.status(400).send({message: `Transaction ${txId} already executed!`})
    return;
  }

  const message = `${recipient}|${amount}|${txId}`;

  const senderPublicKey = recoverMessagePublicKey(message, txSignature, txRecoveryBit);
  const senderAddress = `0x${toHex(addressFromPubKey(senderPublicKey))}`;
  console.log("Resolved sender address:", senderAddress);

  console.log(`Recipient: ${recipient}, sender: ${senderAddress}`)

  const senderBalance = balances[senderAddress] ?? 0;
  console.log("Sender has balance:", senderBalance);
  const recipientBalance = balances[recipient] ?? 0 ;
  console.log("Recipient has balance:", recipientBalance);

  if (senderBalance < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderAddress] = senderBalance - amount;
    balances[recipient] = recipientBalance + amount;
    // Add transactionId to executedTransactions set to avoid multiple tx executions
    executedTransactions[txId] = null;
    res.send({ balance: balances[senderAddress] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
