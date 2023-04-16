import {useState} from "react";
import server from "./server";

function Transfer() {
    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [txId, setTxId] = useState("");
    const [txSignature, setTxSignature] = useState("");
    const [recoveryBit, setRecoveryBit] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function transfer(evt) {
        evt.preventDefault();

        try {
            await server.post(`send`, {
                amount: parseInt(sendAmount),
                recipient,
                txId,
                txSignature,
                txRecoveryBit: parseInt(recoveryBit)
            });
        } catch (ex) {
            alert(ex.response.data.message);
        }
    }

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <label>
                Send Amount
                <input
                    placeholder="1, 2, 3..."
                    value={sendAmount}
                    onChange={setValue(setSendAmount)}
                ></input>
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address, for example: 0x2"
                    value={recipient}
                    onChange={setValue(setRecipient)}
                ></input>
            </label>

            <label>
                Transaction id
                <input
                    placeholder="Type the transaction id, for example: 259127380836447"
                    value={txId}
                    onChange={setValue(setTxId)}
                ></input>
            </label>

            <label>
                Transaction signature
                <input
                    placeholder="Type a transaction signature, for example: 0xddb6b01eb001beea73d4ff5dcc03b0a776931c78d3fea6dfcb42d897c9f96391493bc449ffec39592e47313323aa8eb23f50261178921426862025abfe77cec0"
                    value={txSignature}
                    onChange={setValue(setTxSignature)}
                ></input>
            </label>

            <label>
                Recovery bit
                <input
                    placeholder="Recovery bit"
                    value={recoveryBit}
                    onChange={setValue(setRecoveryBit)}
                ></input>
            </label>

            <input type="submit" className="button" value="Transfer"/>
        </form>
    );
}

export default Transfer;
