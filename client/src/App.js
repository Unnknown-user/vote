import React, { Component } from "react";
import {InputBox} from './components/InputBox/InputBox.component';
import {CardList} from './components/CardList/CardList.component';
import {AdminSearchBox} from './components/SearchBox/AdminSearchBox.component.jsx'
import {AdminCardList} from './components/AdminCardList/AdminCardList.component.jsx';
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleMenu from "./components/Menu/Admin";



class App extends Component {
  constructor(){
    super()
    this.state = { 
      addressValue: "",
      proposalText: "",
      defaultText: "Enter your text",
      defaultProposal: "Enter your proposal",
      whitelistAddress: [], 
      proposalArray: [],
      winningProposal: [],
      web3: null, 
      accounts: null, 
      contract: null,
      //admin: false 
    };
  }
  
/** 
* @param mounting the app is mounting at opening
*/
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();


      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();


      //const admin = await instance.methods.getAccounts({from: accounts[0]});

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

       let getAddress = await instance.methods.getWhitelistAddress().call();
       let Proposals = await instance.methods.getProposalArray().call();
        console.log(Proposals)
      // example of interacting with the contract's methods.
      this.setState({ /*admin,*/ web3, accounts, contract: instance, whitelistAddress: getAddress, proposalArray: Proposals });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };




/**
 * @param Admin this the admin section, to whitelist, verify addresses, change session and tally votes
 */

    submitAddress = async (event) => {
      this.setState({addressValue: event.target.value})


    }

  whitelist = async () => {
    const {accounts, contract } = this.state
    let address = this.state.addressValue;
    await contract.methods.whitelist(address).send({from: accounts[0]})

  }


  getWhitelist = async () => {
    const {contract} = this.state;
    let whitelistAddress = await contract.methods.getWhitelistAddress().call();
    this.setState({whitelistAddress: whitelistAddress})
    console.log(whitelistAddress)
  }

  changeSession = async () => {
    const {accounts, contract } = this.state
    let status = await contract.methods.status().call()

    switch(status){
      case "0":
        console.log("Proposal registration session started")
        await contract.methods.startProposalSession().send({from: accounts[0]})
        break
      case "1":
        console.log("Proposal registration session ended")
        await contract.methods.endProposalSession().send({from: accounts[0]})
        break
       case "2":
        console.log("Voting session started")
        await contract.methods.startVotingSession().send({from: accounts[0]})
        break
      case "3":
        console.log("Voting session ended")
        await contract.methods.endVotingSession().send({from: accounts[0]})
        break
       case "4":
         console.log("voting session is ended, time to tally votes")
         break 
      
        default: 
        
    }
  }

/**
*  @param Users section for user interactions
*/

  createProposal = async () => {
    const {accounts, contract } = this.state
    let proposal_text = this.state.proposalText
    await contract.methods.createProposal(proposal_text).send({from: accounts[0]})
  }

  submitProposal = async (event) => {
      this.setState({proposalText: event.target.value})
      .then(this.setState({proposalText: this.defaultProposal}))
  }

  getProposals = async () => {
    const {contract} = this.state;
    let Proposals = await contract.methods.getProposalArray().call();
    this.setState({proposalArray: Proposals})
  }

  vote = async (proposal_id) => {
    const {accounts, contract } = this.state
    await contract.methods.vote(proposal_id).send({from: accounts[0]})
    .then(this.getProposals)
  }

  tallyVotes = async () => {
    const {accounts, contract } = this.state
    await contract.methods.tallyVotes().send({from: accounts[0]})
    .then(console.log(contract.methods.getWinningProposal().call()))
    let winner = await console.log(contract.methods.getWinningProposal().call())
    this.setState({winningProposal: winner})
  }




  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Voting system is ready.</p>
        <br/>
        {this.state.admin ? <SimpleMenu /> : null }
        <div className="Admin-menu">
          <AdminSearchBox 
            submitAddress={this.submitAddress} 
            whitelist={this.whitelist}
            ph={this.state.defaultText}
            
             />
          <AdminCardList 
            whitelist={this.state.whitelistAddress} 
            getWhitelist={this.getWhitelist} 
          />
          <button 
            onClick={this.changeSession}>
            Change session
          </button>
        </div>

        <div className="Proposal-menu">
          <InputBox 
            submitProposal={this.submitProposal} 
            createProposal={this.createProposal} 
            ph={this.state.defaultProposal}/>
          <CardList 
            proposalArray={this.state.proposalArray}
            getProposals={this.getProposals}
            vote={e => this.vote(e.target.id)}
          />
        </div> 
        <button onClick={this.tallyVotes}>Tally votes</button>
    <p>{this.state.winningProposal}</p>
      </div>
    );
  }
}


export default App;


