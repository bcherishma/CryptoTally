import React,{useState} from 'react';

const ethers = {
    providers:{
        Web3Provider: class {
            constructor() {}
            send(){ return Promise.resolve(); }
            getSigner() { return {}; }
        }
    },
    Contract: class {
        constructor() {}
        castVote() {
            return {
                hash: '0x123abc',
                wait: () => new Promise(resolve => setTimeout(resolve.2000))
            };
        }
    }
};
const contractAddress = "0xMockContractAddress";
const generateZKP = asybc(voterData,vote) => {
    console.log("Simulating ZKP generation . . .");
    await new Promise(resolve => setTimeout(resolve,3000));

    const proof = {
        pi_a: [1,2],
        pi_b: [[1,2],[3,4]],
        pi_c: [5,6]
    };
    const encryptedVote = btoa(vote);

    const publicSignals = [
        voterData.merkleRoot,
        voterData.nullifier,
        encryptedVote
    ];

    console.log("ZKP generation complete.");
    return {proof,publicSignals};
};

const appStyles = {
    container:{
        
    }
}