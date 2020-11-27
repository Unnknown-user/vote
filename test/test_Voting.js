const { expect } = require('chai');
const { BN } = require('@openzeppelin/test-helpers');

const Voting = artifacts.require('../contracts/Voting.sol');

contract('Voting', function (accounts) {
    const owner = accounts[0];
    const Voter1 = accounts[1];
    const Voter2 = accounts[2];
    
 

    const status = { 
        0 : "RegisteringVoters",
        1 : "ProposalsRegistrationStarted",
        2 : "ProposalsRegistrationEnded",
        3 : "VotingSessionStarted",
        4 : "VotingSessionEnded",
        5 : "VotesTallied"
    } 

    beforeEach(async function () {
      this.VotingInstance = await Voting.new({from: owner})
    });
    it("le voter n'est pas sur la whitelist", async function() {
        let isVoterBefore = (await this.VotingInstance.voters(Voter1)).isRegistered;
        expect(isVoterBefore).to.be.false;
        await this.VotingInstance.whitelist(Voter1, {from: owner});
        let isVoterAfter = (await this.VotingInstance.voters(Voter1)).isRegistered;
        expect(isVoterAfter).to.be.true;
    });
    
})