// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EpisodeNFT
 * @dev ERC721 contract for minting webtoon episode NFTs with royalty support
 * @notice Each NFT represents a unique episode from a webtoon series
 */
contract EpisodeNFT is ERC721, ERC721URIStorage, ERC2981, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Struct to store episode metadata
    struct EpisodeData {
        uint256 seriesId;
        uint256 episodeNumber;
        address creator;
        uint256 mintedAt;
    }

    // Mapping from token ID to episode data
    mapping(uint256 => EpisodeData) private _episodeData;

    // Default royalty percentage (in basis points, e.g., 500 = 5%)
    uint96 public constant DEFAULT_ROYALTY_BPS = 500;

    // Events
    event EpisodeMinted(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 seriesId,
        uint256 episodeNumber,
        string metadataURI
    );

    constructor() ERC721("Tempura Episode", "TEMPURA") Ownable(msg.sender) {}

    /**
     * @dev Mints a new episode NFT
     * @param creator Address of the episode creator (receives NFT and royalties)
     * @param metadataURI IPFS or HTTP URI pointing to episode metadata
     * @param seriesId Unique identifier for the webtoon series
     * @param episodeNumber Episode number within the series
     * @return tokenId The ID of the newly minted token
     */
    function mintEpisode(
        address creator,
        string memory metadataURI,
        uint256 seriesId,
        uint256 episodeNumber
    ) public returns (uint256) {
        require(creator != address(0), "Invalid creator address");
        require(bytes(metadataURI).length > 0, "Metadata URI required");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(creator, tokenId);
        _setTokenURI(tokenId, metadataURI);

        // Set royalty for this token (creator receives royalties on secondary sales)
        _setTokenRoyalty(tokenId, creator, DEFAULT_ROYALTY_BPS);

        // Store episode data
        _episodeData[tokenId] = EpisodeData({
            seriesId: seriesId,
            episodeNumber: episodeNumber,
            creator: creator,
            mintedAt: block.timestamp
        });

        emit EpisodeMinted(tokenId, creator, seriesId, episodeNumber, metadataURI);

        return tokenId;
    }

    // ============ Public Metadata Getters ============

    /**
     * @dev Returns the series ID for a given token
     */
    function getSeriesId(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _episodeData[tokenId].seriesId;
    }

    /**
     * @dev Returns the episode number for a given token
     */
    function getEpisodeNumber(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _episodeData[tokenId].episodeNumber;
    }

    /**
     * @dev Returns the creator address for a given token
     */
    function getCreator(uint256 tokenId) public view returns (address) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _episodeData[tokenId].creator;
    }

    /**
     * @dev Returns the mint timestamp for a given token
     */
    function getMintedAt(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _episodeData[tokenId].mintedAt;
    }

    /**
     * @dev Returns all episode data for a given token
     */
    function getEpisodeData(uint256 tokenId) public view returns (EpisodeData memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _episodeData[tokenId];
    }

    /**
     * @dev Returns the current token count
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // ============ Required Overrides ============

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
