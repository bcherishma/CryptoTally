pragma solidity ^0.8.0;

interface IVerifier{
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) external view returns(bool r);
}

contract Voting{
    IVerifier public verifier;
    bytes32 public voterMerkleRoot;
    mapping(bytes32=>bool) public usedNullifiers;
    bytes32[] public encryptedVotes;
    event VoteCasted(bytes32 indexed _nullifier,bytes32 _encryptedVote);

    constructor(bytes32 _initialMerkleRoot,address _verifierAddress){
        voterMerkleRoot = _initialMerkleRoot;
        verifier = IVerifier(_verifierAddress);
    }
    function updateVoters(bytes32 newRoot) public{
        voterMerkleRoot = newRoot;
    }
    function castVote(
        uint[2] memory _proofA,
        uint[2][2] memory _proofB,
        uint[2] memory _proofC,
        uint[3] memory _publicSignals,
        bytes32 _nullifier
    ) public {
        require(_publicSignals[0] == uint256(voterMerkleRoot),"Invalid Merkle root.");
        require(_publicSignals[1] == uint256(_nullifier),"Invalid _nullifier.");
        require(!usedNullifiers[_nullifier],"Nullifier has already been used.");
        
        bool isValid = verifier.verifyProof(_proofA,_proofB,_proofC,_publicSignals);
        require(isValid,"Invalid ZKP.");

        usedNullifiers[_nullifier] = true;
        encryptedVotes.push(bytes32(_publicSignals[2]));

        emit VoteCasted(_nullifier,bytes32(_publicSignals[2]));
    }
}