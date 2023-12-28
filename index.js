const {ApiPromise, WsProvider} = require("@polkadot/api");
const {Keyring} = require("@polkadot/keyring");
const {randomAsU8a} = require("@polkadot/util-crypto");

async function main(){
    const provider = new WsProvider('wss://westend-rpc.polkadot.io');

    const api = await ApiPromise.create({provider});

    const keyring = new Keyring({type: 'sr25519'});

    const alicePair = keyring.addFromUri('crane gift stool razor jeans husband daring flat rate stone neck talk');

    const recipient = keyring.addFromSeed(randomAsU8a(32)).address;

    console.log("Enviando saldos da conta: ", alicePair.address, "para a conta: ", recipient);

    api.tx.balances.transferAllowDeath(recipient, 100).signAndSend(alicePair, {nonce: -1}, ({events = [], status}) => {
        console.log("Status da transação: ", status.type);

        if (status.isInBlock){
            console.log("Incluido bloco no hash: ", status.asInBlock.toHex());
            console.log("Eventos: ");

            events.forEach(({event: {data, method, section}, phase}) => {
                console.log("\t", phase.toString(), `: ${section}.${method}`, data.toString());
            })
        } else if (status.isFinalized){
            console.log("Bloco finalizado no hash: ", status.asFinalized.toHex());

            process.exit(0);
        }
    })
}

main().catch(console.error);