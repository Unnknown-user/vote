import React from 'react';
import {AdminCard} from '../AdminCard/AdminCard.component'

export const AdminCardList = ({getWhitelist,whitelist}) => (
    <div>
        <h1>listing whitelist</h1>
        <button onClick={getWhitelist} >Show whitelist</button>
        {whitelist.map(address => (
            <AdminCard key={address} address={address}/>
        ))}
    
    </div>
)