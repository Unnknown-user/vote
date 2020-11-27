import React from 'react';

export const AdminSearchBox = ({submitAddress,whitelist, ph}) => (
    <div>
    <input onChange={submitAddress} placeholder={ph} />
    <button onClick={whitelist}>Whitelist address</button>
    </div>
) 