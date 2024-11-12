const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('RewardSystem', () => {
    let RewardSystem, rewardSystem;
    let owner, contributor; 
    const nftMilestone = 10;
    const rewardAmount = ethers.parseEther("0.1"); 

    before(async function() {
        [owner, contributor] = await ethers.getSigners();
        RewardSystem = await ethers.getContractFactory("RewardSystem"); 
        rewardSystem = await RewardSystem.connect(owner).deploy(nftMilestone, rewardAmount);
        await rewardSystem.waitForDeployment(); 
        console.log(await rewardSystem.getAddress());
    });

    it("gives the address", async function() {
        expect(await rewardSystem.getAddress()).to.be.properAddress;
    });

    it("should find the contract with ETH", async function() {
        // Send 10 ETH to the rewardSystem contract
        const txd = await owner.sendTransaction({
            to: await rewardSystem.getAddress(),
            value: ethers.parseEther("10") 
        });
        console.log(txd)
        const contractBalance = await ethers.provider.getBalance(await rewardSystem.getAddress());

        expect(contractBalance).to.equal(ethers.parseEther("10"));
    });

    it("shoudl reward contributor with eTH per contrubution", async function(){
        const intialBalance = await ethers.provider.getBalance(contributor.address);
        await rewardSystem.connect(owner).contribute(contributor.address, "https://example.com/nft1"); 

        const finalBalance = await ethers.provider.getBalance(contributor.address);
        expect(finalBalance).to.be.above(intialBalance);
    })

    it("should mint an NFT at every milestone", async function () {
        for (let i = 2; i <= nftMilestone; i++) {
          await rewardSystem.connect(owner).contribute(contributor.address, `https://example.com/nft${i}`);
        }
    
        expect(await rewardSystem.balanceOf(contributor.address)).to.equal(1); 
        expect(await rewardSystem.tokenURI(1)).to.equal("https://example.com/nft10");
      });
});
