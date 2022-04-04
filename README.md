# TweetDAO EGG reminter

This contract custodies an original TweetDAO Egg and remints it under the new contract. The original contract had a bug where the 1,000 limit was not observed. This contract limits the supply to the first 1,000.

## How to use

Egg holders call `approve` with a deployed version of this contract to allow this contract to transfer the Egg on their behalf. Then they call `wrap` with the Egg Token id on the contract. This locks the original Egg token to the contract and mints a new one. It only mints Eggs up to token ID 1,000.

## Install

`npm run install`

## Build

`npm run build`

## Flatten (for deploying + verifying on etherscan)

`npm run flatten`

## Testing

`npm run test`

## License

MIT
