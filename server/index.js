const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  const senderBalance = balances[sender] ?? 0;
  const recipientBalance = balances[recipient] ?? 0 ;

  if (senderBalance < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] = senderBalance - amount;
    balances[recipient] = recipientBalance + amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
