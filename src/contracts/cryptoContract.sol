pragma solidity ^0.8.0;

contract CryptoContract {
    struct CryptoData {
        string symbol;
        uint256 price;
        uint256 volume;
        uint256 marketCap;
        uint256 change24h;
        uint256 tradingVolume;
    }

    mapping(string => CryptoData) private cryptoData;

    function storeCryptoData(
        string memory symbol,
        uint256 price,
        uint256 volume,
        uint256 marketCap,
        uint256 change24h,
        uint256 tradingVolume
    ) public {
        cryptoData[symbol] = CryptoData(
            symbol,
            price,
            volume,
            marketCap,
            change24h,
            tradingVolume
        );
    }

    function retrieveCryptoData(string memory symbol)
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        CryptoData memory data = cryptoData[symbol];
        return (
            data.symbol,
            data.price,
            data.volume,
            data.marketCap,
            data.change24h,
            data.tradingVolume
        );
    }
}
