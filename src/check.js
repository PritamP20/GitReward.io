const ethers = require("ethers")
const fs = require("fs")
const json = require("../artifacts/contracts/Reward.sol/RewardSystem.json")

const abi = json.abi;
const contractAddress = "0xC6FA7f414cA19F08Ee42EA86d756681b9Bb41Fc7"
const ownerPrivateKey = "8b87d9854e35388b8f6d9ffba30c5316958e89fdae04326d914f411b463d4b08";
const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/OgX2oq12FWRTYy5zEJj9_5BHxL_JktB0")
const signer = new ethers.Wallet(ownerPrivateKey, provider);
const rewardSystem = new ethers.Contract(contractAddress, abi, signer);
const contributorAddress = "0xb1F77169bd3e7374398d65543474a54d49065C01";
console.log("Contributor Address:", contributorAddress);

const contractFunction = async()=>{
    const rewardAmount = await rewardSystem.rewardAmount();
    let balance = await provider.getBalance(contractAddress);
    console.log("balance: ", balance);
    console.log("rewardAmount: ", rewardAmount);

    const tx = await rewardSystem.connect(signer).contribute(contributorAddress,
        "https://example.com/nft1",
        {
            gasLimit: 22128, 
            gasPrice: ethers.parseUnits("5", "gwei")
        })

    console.log(tx.hash);
    balance = await provider.getBalance(contractAddress);
    console.log(balance)
}
contractFunction()