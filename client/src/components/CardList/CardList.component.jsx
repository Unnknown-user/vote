import React from 'react';
import {Card} from '../Card/Card.component'

export const CardList = ({proposalArray, getProposals, vote}) => (
    <div>
        <h1>listing proposals</h1>
        <button onClick={getProposals} >Show proposals</button>
        {proposalArray.map(proposal => (
            <Card key={proposal.proposalId} proposal={proposal} vote={vote} />
        ))}
    
    </div>
)