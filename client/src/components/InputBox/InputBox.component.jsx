import React from 'react';

export const InputBox = ({submitProposal,createProposal, ph}) => (
    <div>
    <input  onChange={submitProposal} placeholder={ph} />
    <button onClick={createProposal}>Create proposal</button>
    </div>
) 

