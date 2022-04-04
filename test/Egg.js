import { expect, use } from 'chai';
import { Contract, utils } from 'ethers';
import {
    deployContract,
    MockProvider,
    solidity
} from 'ethereum-waffle';

import fs from 'fs';
const Egg = JSON.parse(fs.readFileSync('./build/Egg.json'));
const Test721 = JSON.parse(fs.readFileSync('./build/Test721.json'));

use(solidity);

describe('Egg', () => {
    const tokenURIReminted = 'https://example.com/foo.json';
    const tokenURINewEvent = 'https://example.com/bar.json';
    const [
        deployer,
        minterA,
        minterB,
        minterC,
        recipientA,
        recipientB,
        recipientC,
        ...accounts
    ] = new MockProvider().getWallets();

    let eggContract, testContract;

    it('deploys the Egg remint contract and a test 721 Contract', async () => {
        testContract = await deployContract(deployer, Test721, []);
        eggContract = await deployContract(deployer, Egg, [ testContract.address ]);
    });

    it('mints an NFT on the test contract', async () => {
        await testContract.connect(minterA).mint(1, recipientA.address, tokenURIReminted);
        const tokenURIResult = await testContract.tokenURI(1);
        expect(tokenURIResult).to.equal(tokenURIReminted);
    });

    it('wraps and remints an NFT on the new contract', async () => {
        await testContract.connect(recipientA).approve(eggContract.address, 1);
        await eggContract.connect(recipientA).wrap(1);
        const tokenURIResult = await eggContract.tokenURI(1);
        expect(tokenURIResult).to.equal(tokenURIReminted);
    });

    it('prevents wrap and remint an NFT outside token range', async () => {
        await testContract.connect(minterA).mint(1001, recipientA.address, tokenURIReminted);
        await testContract.connect(recipientA).approve(eggContract.address, 1001);
        await expect(eggContract.connect(recipientA).wrap(1001)).to.be.reverted;
    });

    it('burns the new NFT and unwraps the original', async () => {
        await eggContract.connect(recipientA).approve(testContract.address, 1);
        await eggContract.connect(recipientA).unwrap(1);
        await expect(eggContract.tokenURI(1)).to.be.reverted;
        const owner = await testContract.ownerOf(1)
        expect(owner).to.equal(recipientA.address);
    });
});
