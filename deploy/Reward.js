const {ethers} = require("hardhat")

async function main() {
    const RewardSystem = await ethers.getContractFactory("RewardSystem");
    const rewardSystem = await RewardSystem.deploy(10, ethers.parseEther("0.001")); // Example: 10 contributions milestone and 0.1 ETH reward
    await rewardSystem.waitForDeployment();
  //0x5DB145FEaDeEe86A182e5A4FfC7a2B49C3d79343


  // 0xb1F77169bd3e7374398d65543474a54d49065C01 - deployed address
  //0xC6FA7f414cA19F08Ee42EA86d756681b9Bb41Fc7 --deployed contract address
    console.log("RewardSystem deployed to:", rewardSystem);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  