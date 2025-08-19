const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {MerkleTree} = require('merkletreejs');
const {keccak256} = require('ethereumjs-util');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let registeredVoters = {};
let voterLeaves = [];

const updateMerkleRootOnContract = (root) => {
    console.log(`Simulating: Updated Merkle root on the smart contrast to ${root}`);
};

app.post('/register',(req,res) => {
    const { voterId } = req.body;
    if (!voterId){
        return res.status(400).send('Voter ID is required.');
    }
    if (registeredVoters[voterId]){
        return res.status(409).send('Voter already registered.');
    }

    const privateKey = 'secret_key_' + voterId;
    const voterHash = keccak256(Buffer.from(privateKey)).toString('hex');
    const nullifier = keccak256(Buffer.from(privateKey + 'salt')).toString('hex');

    const newLeaf = Buffer.from(voterHash,'hex');
    voterLeaves.push(newLeaf);

    const tree = new MerkleTree(voterLeaves, keccak256, {sortLeaves: true});
    const merkleRoot = tree.getHexRoot();

    registeredVoters[votersId] = {
        privateKey,
        voterHash,
        nullifier,
        merkleRoot
    };
})