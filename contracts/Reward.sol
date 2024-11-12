// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardSystem is ERC721URIStorage, Ownable {
    uint256 public nftMilestone; 
    uint256 public rewardAmount; 
    uint256 private tokenIdCounter; 

    mapping(address => uint256) public contributions; 

    event ContributionMade(address indexed contributor, uint256 contributionCount);
    event MilestoneAchieved(address indexed contributor, uint256 tokenId, string tokenURI);

    constructor(uint256 _nftMilestone, uint256 _rewardAmount)
        ERC721("ContributorNFT", "CNFT") Ownable(msg.sender)
    {
        nftMilestone = _nftMilestone;
        rewardAmount = _rewardAmount;
    }

    function contribute(address contributor, string memory tokenURI) public payable onlyOwner {
        require(address(this).balance >= rewardAmount, "Insufficient contract balance to reward");

        (bool sent, ) = contributor.call{value: rewardAmount}("");
        require(sent, "Failed to send ETH reward");

        contributions[contributor] += 1;
        emit ContributionMade(contributor, contributions[contributor]);

        if (contributions[contributor] % nftMilestone == 0) {
            tokenIdCounter += 1;
            uint256 newTokenId = tokenIdCounter;
            _mint(contributor, newTokenId);
            _setTokenURI(newTokenId, tokenURI); 
            emit MilestoneAchieved(contributor, newTokenId, tokenURI);
        }
    }
    receive() external payable {}
}
