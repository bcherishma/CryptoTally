const hashVote = (vote) => {
    return Buffer.from(vote).toString('hex');
};
export const generateZKP = async (voterData, vote) => {
    console.log("Simulating ZKP generation . . .");
    await new Promise(resolve => setTimeout(resolve,3000));

    const proof = {
        pi_a:[1,2],
        pi_b:[[1,2],[3,4]],
        pi_c:[5,6]
    };
    const publicSignals = [
        voterData.merkleRoot,
        voterData.nullifier,
        ebcryptedVote
    ];
    console.log("ZKP generation complete.");
    return {proof,publicSignals};
}