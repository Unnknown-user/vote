import React from "react";
import './Card.styles.css'

export const Card = ({proposal, vote}) => (
    <div className="Proposal-card">
       <p>{proposal.description}</p> 
       <p>vote count: {proposal.voteCount}</p>
       <button onClick={vote} id={proposal.proposalId}>Vote</button>
    </div>
) 