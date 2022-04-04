// SPDX-License-Identifier: MIT
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Burnable.sol';

pragma solidity 0.6.12;

contract Egg is ERC721Burnable {
    address private tokenContract;

    constructor(address _ogContract) public ERC721("TweetDAO Eggs", "EGG") {
        tokenContract = _ogContract;
    }

    /**
     * Burn a token from another contract and mint it here, copying the metadata
     * The token owner must have `approve` this contract to access the token beforehand
     */
    function wrap(uint256 tokenID) public {
        require(tokenID <= 1000, "Cannot mint past the first 1,000 Eggs");

        // Grab the original tokenURI
        ERC721Burnable collection = ERC721Burnable(tokenContract);
        string memory tokenURI = collection.tokenURI(tokenID);

        // Lock the source NFT
        collection.transferFrom(_msgSender(), address(this), tokenID);

        _mint(_msgSender(), tokenID);
        _setTokenURI(tokenID, tokenURI);
    }

    function unwrap(uint256 tokenID) public {
        require(this.ownerOf(tokenID) == _msgSender(), "Not owner");
        transferFrom(_msgSender(), address(this), tokenID);
        _burn(tokenID);

        ERC721Burnable collection = ERC721Burnable(tokenContract);
        collection.transferFrom(address(this), _msgSender(), tokenID);
    }
}
