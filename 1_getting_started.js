const express = require("express");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const app = express();
const port = 3000;

const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjhkMjMxNDI0LWYxNDYtNGIzZS1iOTlkLTgyYmU3ZjRhMmQ5YSIsIm9yZ0lkIjoiMzU5OTExIiwidXNlcklkIjoiMzY5ODg5IiwidHlwZUlkIjoiZWM5N2IyOWMtNDg2Ny00NmQ5LTk1MTctNmIxYWU4Mzc1N2JlIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTY0ODQwNTcsImV4cCI6NDg1MjI0NDA1N30.8Vk8bK8jUm6PqdxRacSfotbRMKUmwNfyd-l_XZ8_XQU";
const address = "0x668425484835D082D11e3A83b97D47705Ef6ACA4";
const chain = EvmChain.SEPOLIA;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

async function getBalance() {
    const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
        address,
        chain,
    });
    const native = nativeBalance.result.balance.ether;
    return { native };
}

app.get("/balance", async (req, res) => {
    try {
        const data = await getBalance();
        res.status(200);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({ error: error.message });
    }
});

async function getNFTBalance() {
    const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
        address,
        chain,
    });
    const native = nativeBalance.result.balance.ether;

    const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain,
    });
    const tokens = tokenBalances.result.map((token) => token.display());
    return { native, tokens };
}

app.get("/NFT", async (req, res) => {
    try {
        const data = await getNFTBalance();
        res.status(200);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({ error: error.message });
    }
});

const startServer = async () => {
    await Moralis.start({
        apiKey: MORALIS_API_KEY,
    });

    app.listen(port, () => {
        console.log(`Listening on port http://localhost:${port}`);
    });
};
startServer();

