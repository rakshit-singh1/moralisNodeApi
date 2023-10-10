const express = require("express");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const dotenv = require("dotenv");
dotenv.config();

const app = express();


/*------------------------------Wallet API------------------------------*/

app.post("/1_Wallet_details/:address", async (req, res) => {
    try {
        //const address = "0x668425484835D082D11e3A83b97D47705Ef6ACA4";
        const address = req.params.address;
        const chains = [EvmChain.ETHEREUM, EvmChain.BSC, EvmChain.POLYGON];
        const response = await Moralis.EvmApi.wallets.getWalletActiveChains({
            address,
            chains,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/2_Native_balance/:address", async (req, res) => {
    try {
        //const address = "0x668425484835D082D11e3A83b97D47705Ef6ACA4";
        const address = req.params.address;
        // const chain = EvmChain.SEPOLIA;
        const chain = EvmChain.GOERLI;
        const response = await Moralis.EvmApi.balance.getNativeBalance({
            address,
            chain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/3_NFT_balance/:address", async (req, res) => {
    try {
        //const address = "0x668425484835D082D11e3A83b97D47705Ef6ACA4";
        const address = req.params.address;
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain,
        });
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            Message: "NFT Balance of a single chain",
            responseResult: {
                result: response.result.map((nft) => ({
                    amount: nft.amount,
                    name: nft.name,
                    symbol: nft.symbol,
                })),
            },
        };
        const a = JSON.stringify(cleaned_response);
        console.log(JSON.stringify(response));
        const chains = [EvmChain.SEPOLIA, EvmChain.MUMBAI, EvmChain.POLYGON];
        const allNFTs = [];
        for (const chain of chains) {
            const response1 = await Moralis.EvmApi.nft.getWalletNFTs({
                address,
                chain,
            });
            const cleaned_response1 = {
                statusCode: 200,
                flag: true,
                Message: `NFT Balance of a ${JSON.stringify(chain)} chain`,
                responseResult: JSON.stringify({
                    result: response1.result.map((nft) => ({
                        amount: nft.amount,
                        name: nft.name,
                        symbol: nft.symbol,
                    })),
                }),
            };
            allNFTs.push(cleaned_response1);
        }
        console.log("flgmkjlnhkjnykty", allNFTs);
        res.status(200).send(`
            A:
            ${a}
            B:
            ${JSON.stringify(allNFTs)}
        `);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/4_ERC20_balance/:address", async (req, res) => {
    try {
        //const address = "0x668425484835D082D11e3A83b97D47705Ef6ACA4";
        const address = req.params.address;
        const chain = EvmChain.GOERLI;
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            address,
            chain,
        });
        const data = JSON.parse(JSON.stringify(response));
        //console.log(data[1]);
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            Message: "Wallet balance as per perticular token",
            responseResult: {
                result: data.map((element) => ({
                    name: element.name,
                    balance: element.balance,
                    symbol: element.symbol,
                })),
            },
        };
        console.log(JSON.stringify(cleaned_response));
        res.status(200).json(cleaned_response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/5_transactions/:address", async (req, res) => {
    try {
        //const address = "0x668425484835D082D11e3A83b97D47705Ef6ACA4";
        const address = req.params.address;
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.transaction.getWalletTransactions({
            address,
            chain,
        });
        const data = JSON.parse(JSON.stringify(response));
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            "page_size": data.page_size,
            "page": data.page,
            Message: "Transactions for given wallet address",
            responseResult: {
                result: data.result.map((element) => ({
                    hash: element.hash,
                    nonce: element.nonce,
                    from_address: element.from_address,
                    to_address: element.to_address,
                    value: element.value,
                    gas: element.gas,
                    gas_price: element.gas_price,
                    receipt_gas_used: element.receipt_gas_used,
                    receipt_status: element.receipt_status,
                    block_timestamp: element.block_timestamp,
                    block_number: element.block_number,
                    block_hash: element.block_hash,
                })),
            },
        };
        console.log(cleaned_response);
        res.status(200).json(cleaned_response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/6_NFT_transfer/:address", async (req, res) => {
    try {
        // const address = "0x668425484835D082D11e3A83b97D47705Ef6ACA4";
        // const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
        const address = req.params.address;
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.nft.getWalletNFTTransfers({
            address,
            chain,
        });
        const data = JSON.parse(JSON.stringify(response));
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            "page_size": data.page_size,
            "page": data.page,
            Message: "Transactions for given wallet address",
            responseResult: {
                result: data.result.map((element) => ({
                    block_number: element.block_number,
                    block_timestamp: element.block_number,
                    block_hash: element.block_number,
                    transaction_hash: element.block_number,
                    contract_type: element.block_number,
                    transaction_type: element.block_number,
                    token_address: element.block_number,
                    token_id: element.block_number,
                    from_address: element.block_number,
                    to_address: element.block_number,
                    amount: element.block_number,
                })),
            },
        };
        console.log(cleaned_response);
        res.status(200).json(cleaned_response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/7_ERC20_transfers/:address", async (req, res) => {
    try {
        // const address = "0x668425484835D082D11e3A83b97D47705Ef6ACA4";
        const address = req.params.address;
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
            address,
            chain,
        });
        const data = JSON.parse(JSON.stringify(response));
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            "page_size": data.page_size,
            "page": data.page,
            Message: "Transactions for given wallet address",
            responseResult: {
                result: data.result.map((element) => ({
                    token_name: element.token_name,
                    token_symbol: element.token_symbol,
                    from_address: element.from_address,
                    to_address: element.to_address,
                    address: element.address,
                    block_hash: element.block_hash,
                    block_number: element.block_number,
                    block_timestamp: element.block_timestamp,
                    transaction_hash: element.transaction_hash,
                })),
            },
        };
        res.status(200).json(cleaned_response);
        console.log(cleaned_response)
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/8_address_by_domain/:domain", async (req, res) => {
    try {
        // const domain = "vitalik.eth";
        const domain = req.params.domain;
        const response = await Moralis.EvmApi.resolve.resolveENSDomain({
            domain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/9_name_by_address/:address", async (req, res) => {
    try {
        // const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
        const address = req.params.address;
        const response = await Moralis.EvmApi.resolve.resolveAddress({
            address,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/10_name_by_nstopable_domain", async (req, res) => {
    try {
        // const domain = "brad.crypto";
        const domain = req.params.domain;
        const response = await Moralis.EvmApi.resolve.resolveDomain({
            domain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

/*------------------------------NFT API------------------------------*/

app.post("/1_NFT_by_contract/:address", async (req, res) => {
    try {
        // const address = "0xEFA8914380D57710De8dA5E64544E2FC53ed8D9F";
        const address = req.params.address;
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.nft.getContractNFTs({
            address,
            chain,
        });
        const data = JSON.parse(JSON.stringify(response));
        //console.log(data[1]);
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            Message: "NFTs of a contract",
            responseResult: {
                result: data.result.map((element) => ({
                    token_hash: element.token_hash,
                    token_address: element.token_hash,
                    token_id: element.token_hash,
                    block_number_minted: element.token_hash,
                    amount:element.token_hash,
                    contract_type: element.token_hash,                
                    token_uri: element.token_hash,
                    last_token_uri_sync:element.token_hash,
                    last_metadata_sync: element.token_hash,
                })),
            },
        };
        console.log(cleaned_response);
        res.status(200).json(cleaned_response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/2_NFT_Metadata/:address/:tokenId", async (req, res) => {
    try {
        const chain = EvmChain.SEPOLIA;
        // const address = "0xEFA8914380D57710De8dA5E64544E2FC53ed8D9F";
        const address = req.params.address;
        // const tokenId = "1";
        const tokenId = req.params.tokenId;
        const response = await Moralis.EvmApi.nft.getNFTMetadata({
            address,
            chain,
            tokenId,
            normalizeMetadata: true,
        });
        const element = JSON.parse(JSON.stringify(response));
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            Message: "NFTs",
            responseResult: {
            token_address: element.token_address,
            token_id: element.token_id,
            owner_of: element.owner_of,
            block_number: element.block_number,
            block_number_minted: element.block_number_minted,
            token_hash: element.token_hash,
            amount:element.amount,
            contract_type: element.contract_type,
            normalized_metadata: {
                name: element.normalized_metadata.name,
                description: element.normalized_metadata.description,
                image: element.normalized_metadata.image,
                    },
            },
        };
        console.log(cleaned_response);
        res.status(200).json(cleaned_response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/3_NFT_transfer_by_block/:blockNumberOrHash", async (req, res) => {
    try {
        const chain = EvmChain.SEPOLIA;
        const blockNumberOrHash = req.params.blockNumberOrHash;
        const response = await Moralis.EvmApi.nft.getNFTTransfersByBlock({
            // blockNumberOrHash: 4272972,
            blockNumberOrHash,
            chain,
        });
        const data = JSON.parse(JSON.stringify(response));
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            "page_size": data.page_size,
            "page": data.page,
            Message: "Transactions in given block number",
            responseResult: {
                result: data.result.map((element) => ({
                    "block_number": element.block_number,
                    "block_timestamp": element.block_timestamp,
                    "block_hash": element.block_hash,
                    "transaction_hash": element.transaction_hash,
                    "contract_type": element.contract_type,
                    "token_address": element.token_address,
                    "token_id": element.token_id,
                    "from_address": element.from_address,
                    "to_address": element.to_address,
                    "amount": element.amount,
                })),
            },
        };
        res.status(200).json(cleaned_response);
        console.log(cleaned_response)
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/4_NFT_transfer_by_Collection/:address", async (req, res) => {
    try {
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.nft.getNFTContractTransfers({
            address:// "0xEFA8914380D57710De8dA5E64544E2FC53ed8D9F",
            req.params.address,
            chain,
        });
        const data = JSON.parse(JSON.stringify(response));
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            "page_size": data.page_size,
            "page": data.page,
            Message: "Transactions in given block number",
            responseResult: {
                result: data.result.map((element) => ({
                    "block_number": element.block_number,
                    "block_timestamp": element.block_timestamp,
                    "block_hash": element.block_hash,
                    "transaction_hash": element.transaction_hash,
                    "contract_type": element.contract_type,
                    "token_address": element.token_address,
                    "token_id": element.token_id,
                    "from_address": element.from_address,
                    "to_address": element.to_address,
                    "amount": element.amount,
                })),
            },
        };
        res.status(200).json(cleaned_response);
        console.log(cleaned_response)
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/5_NFT_transfer_by_Id/:id", async (req, res) => {
    try {
        const chain = EvmChain.SEPOLIA;
        const address = "0xEFA8914380D57710De8dA5E64544E2FC53ed8D9F";
        const response = await Moralis.EvmApi.nft.getNFTTransfers({
            address,
            tokenId: req.params.id,
            chain,
        });
        const data = JSON.parse(JSON.stringify(response));
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            "page_size": data.page_size,
            "page": data.page,
            Message: "Transactions in given block number",
            responseResult: {
                result: data.result.map((element) => ({
                    "block_number": element.block_number,
                    "block_timestamp": element.block_timestamp,
                    "block_hash": element.block_hash,
                    "transaction_hash": element.transaction_hash,
                    "contract_type": element.contract_type,
                    "token_address": element.token_address,
                    "token_id": element.token_id,
                    "from_address": element.from_address,
                    "to_address": element.to_address,
                    "amount": element.amount,
                })),
            },
        };
        res.status(200).json(cleaned_response);
        console.log(cleaned_response)
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/6_NFT_Collection_by_wallet/:address", async (req, res) => {
    try {
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
            address: //"0x668425484835D082D11e3A83b97D47705Ef6ACA4",
                req.param.address,
            chain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/7_NFT_Owner_by_contract", async (req, res) => {
    try {
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.nft.getNFTOwners({
            address: "0xEFA8914380D57710De8dA5E64544E2FC53ed8D9F",
            chain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/8_NFT_Owner_by_Id", async (req, res) => {
    try {
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.nft.getNFTTokenIdOwners({
            address: "0xEFA8914380D57710De8dA5E64544E2FC53ed8D9F",
            chain,
            tokenId: 1,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/9_NFT_Owner_by_Collection", async (req, res) => {
    try {
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.nft.getNFTOwners({
            address: "0xEFA8914380D57710De8dA5E64544E2FC53ed8D9F",
            chain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/10_NFT_Lowest_Price", async (req, res) => {
    try {
        const chain = EvmChain.ETHEREUM;
        const response = await Moralis.EvmApi.nft.getNFTLowestPrice({
            address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
            chain,
            marketplace: "opensea",
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/11_NFT_Trades_By_Marketplace", async (req, res) => {
    try {
        const chain = EvmChain.ETHEREUM;
        const response = await Moralis.EvmApi.nft.getNFTTrades({
            address: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
            chain,
            marketplace: "opensea",
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

/*------------------------------Token API------------------------------*/

app.post("/1_ERC20_Token_Price", async (req, res) => {
    try {
        const chain = EvmChain.ETHEREUM;
        const response = await Moralis.EvmApi.token.getTokenPrice({
            address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
            chain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/2_ERC20_transfer_by_contract", async (req, res) => {
    try {
        const chain = EvmChain.ETHEREUM;
        const response = await Moralis.EvmApi.token.getTokenTransfers({
            address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
            chain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/3_Get_Pair_Address_Of_Sushiswap", async (req, res) => {
    try {
        const chain = EvmChain.ETHEREUM;
        // token 0 address, e.g. WETH token address
        const token0Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
        // token 1 address, e.g. LINK token address
        const token1Address = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
        const response = await Moralis.EvmApi.defi.getPairAddress({
            token0Address,
            token1Address,
            chain,
            exchange: "sushiswapv2",
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/4_Pair_Reserves_Of_Sushiswap", async (req, res) => {
    try {
        const chain = EvmChain.ETHEREUM;
        const pairAddress = "0xc40d16476380e4037e6b1a2594caf6a6cc8da967";
        const response = await Moralis.EvmApi.defi.getPairReserves({
            pairAddress,
            chain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/5_Pair_Address_Of_Uniswap", async (req, res) => {
    try {
        const chain = EvmChain.ETHEREUM;
        // token 0 address, e.g. WETH token address
        const token0Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
        // token 1 address, e.g. LINK token address
        const token1Address = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
        const response = await Moralis.EvmApi.defi.getPairAddress({
            token0Address,
            token1Address,
            chain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/6_Uniswap_Pair_Reserves", async (req, res) => {
    try {
        const chain = EvmChain.ETHEREUM;
        const pairAddress = "0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974";
        const response = await Moralis.EvmApi.defi.getPairReserves({
            pairAddress,
            chain,
        });
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

/*------------------------------Market Data API------------------------------*/

app.post("/1_Top_ERC20_Tokens_By_Market_Cap", async (req, res) => {
    try {
        const response =
            await Moralis.EvmApi.marketData.getTopERC20TokensByPriceMovers();
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/2_Top_ERC20_Tokens_By_Price_Change", async (req, res) => {
    try {
        const response =
            await Moralis.EvmApi.marketData.getHottestNFTCollectionsByTradingVolume();
        console.log(response.toJSON());
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

/*------------------------------Blockchain API------------------------------*/

app.post("/1_Logs_Of_Contract/:address/:topic0", async (req, res) => {
    try {
        //const address = "0xEFA8914380D57710De8dA5E64544E2FC53ed8D9F";
        const address = req.params.address;
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.events.getContractLogs({
            address,
            topic0:req.params.topic0,
                // "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
            chain,
        });
        const data = JSON.parse(JSON.stringify(response));
        //console.log(data[1]);
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            Message: "Logs Of Contract",
            responseResult: {
                result: data.result.map((element) => ({
                    transaction_hash:element.transaction_hash,
                    address:element.address,
                    block_timestamp:element.block_timestamp,
                    block_number:element.block_number,
                    block_hash:element.block_hash,
                    data:element.data,
                    topic0:element.topic0,
                    topic1:element.topic1,
                    topic2:element.topic2,
                    topic3:element.topic3,
                })),
            },
        };
        console.log(cleaned_response);
        res.status(200).json(cleaned_response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

app.post("/2_Events_Of_Contract/:address/:topic", async (req, res) => {
    try {
        //const address = "0xEFA8914380D57710De8dA5E64544E2FC53ed8D9F";
        const address = req.params.address;
        const topic = req.params.topic
            // "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62";
        // "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0";
        const chain = EvmChain.SEPOLIA;
        const abi =
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "operator",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "bool",
                    name: "approved",
                    type: "bool",
                },
            ],
            name: "ApprovalForAll",
            type: "event",
        };
        // {
        //     anonymous: false,
        //     inputs: [
        //         {
        //             indexed: true,
        //             internalType: "address",
        //             name: "previousOwner",
        //             type: "address",
        //         },
        //         {
        //             indexed: true,
        //             internalType: "address",
        //             name: "newOwner",
        //             type: "address",
        //         },
        //     ],
        //     name: "OwnershipTransferred",
        //     type: "event",
        // };
        const response = await Moralis.EvmApi.events.getContractEvents({
            address,
            chain,
            topic,
            abi,
        });
        const data = JSON.parse(JSON.stringify(response));
        //console.log(data[1]);
        const cleaned_response = {
            statusCode: 200,
            flag: true,
            Message: "Events of contract",
            responseResult: {
                result: data.result.map((element) => ({
                    transaction_hash: element.transaction_hash,
                    address: element.address,
                    block_timestamp: element.block_timestamp,
                    block_number: element.block_number,
                    block_hash: element.block_hash,
                    account: element.data.account,
                    operator: element.data.operator,
                })),
            },
        };
        console.log(cleaned_response);
        res.status(200).json(cleaned_response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ flag: false, error: error.message });
    }
});

/*------------------------------server------------------------------*/

const startServer = async () => {
    try {
        await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
        });

        const port = process.env.PORT || 3000;
        const portNumber = parseInt(port, 10);

        app.listen(portNumber, () => {
            console.log(`Server is running on port http://localhost:${portNumber}/`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

startServer();
