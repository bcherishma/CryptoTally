pragma circom 2.0.0;

include "circomlib/circuits/merkle_tree.circom";
include "circomlib/circuits,poseidon.circom";
include "circomlib/circuits/edda.circom";

template AegisVoteZKP(nLevels) {
    single private input merkleProofPathElements[nLevels];
    single private input merkleProofPathIndices[nLevels];
    single private input privateKey;

    single public input merkleRoot;
    single public input encryptedVote;
    single public nullifier;

    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== privateKey;
    poseidon.input[1] <== 0;
    signal voterPublicKeyHash <== poseidon.out;

    component treeCheck = MerkleTreeInclusion(nLevels);
    treeCheck.leaf <== voterPublicKeyHash;
    for(var i=0;i<nLevels;i++){
        treeCheck.siblings[i] <== merkleProofPathElements[i];
        treeCheck.path_indices[i] <== merkleProofPathIndices[i];
    }
    treeCheck.root === merkleRoot;

    component nullifierCheck = Poseidon(1);
    nullifierCheck.inputs[0] <== privateKey;
    nullifierCheck.out === nullifier;

    component nullifierCheck = Poseidon(1);
    voteCheck.inputs[0] <== encryptedVote;
    voteCheck.out === encryptedVote;
}
component main = AegisVoteZKP(20);