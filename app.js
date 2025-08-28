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
                wait: () => new Promise(resolve => setTimeout(resolve,2000))
            };
        }
    }
};
const contractAddress = "0xMockContractAddress";
const generateZKP = async(voterData,vote) => {
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
        fontFamily: '"Inter", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e002e 0%, #0a0a2a 100%)',
        color: '#e0e0e0',
        padding: '2rem',
        boxSizing: 'border-box',
        textAlign: 'center',
      },
      card: {
        background: 'rgba(30, 30, 63, 0.7)',
        borderRadius: '16px',
        padding: '2.5rem',
        margin: '1rem 0',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        width: '100%',
        maxWidth: '500px',
        animation: 'fadeIn 1s ease-in-out',
      },
      title: {
        color: '#8925d1',
        marginBottom: '1.5rem',
        fontSize: '2.5rem',
        textShadow: '0 0 10px rgba(137, 37, 209, 0.5)',
      },
      heading: {
        color: '#b08fcc',
        fontSize: '1.5rem',
        marginBottom: '1rem',
      },
      button: {
        background: 'linear-gradient(90deg, #8925d1 0%, #a24bcf 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        marginTop: '0.5rem',
        boxShadow: '0 4px 15px rgba(162, 75, 207, 0.4)',
        margin: '0.5rem',
      },
      buttonHover: {
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 20px rgba(162, 75, 207, 0.6)',
      },
      input: {
        width: '100%',
        padding: '0.75rem',
        margin: '1rem 0',
        borderRadius: '8px',
        border: '1px solid #4a4a6b',
        backgroundColor: '#3a3a5e',
        color: '#e0e0e0',
        boxSizing: 'border-box',
        fontSize: '1rem',
      },
      status: {
        marginTop: '2rem',
        color: '#b08fcc',
        fontWeight: 'bold',
        minHeight: '2rem', // Prevents layout shift
      },
      selection: {
        marginTop: '1rem',
        fontSize: '1.2rem',
      }
};
const App = () => {
    const[voterId,setVoterId] = useState('');
    const[vote,setVote] = useState('');
    const[status,setStatus] = useState('');
    const[voterData,setVoterData] = useState(null);

    const handleLogin  = async () => {
        setStatus('Fetching Voter Data . . .');
        try {
          const response = await fetch('http://localhost:3001/voter/${voterId}');
          if (!response.ok) throw new Error('Voter Not Found');
          const data = await response.json();
          setVoterData(data);
          setStatus('Voter data loaded.Ready to Vote.');
        } catch(error) {
          setStatus('Error: ${error.message}');
        }
    }; 
    const handleVote = async () => {
        if(!boterData || !vote)
        {
          setStatus('Please log in and select a candidate.');
          return;
        }
        setStatus('Generating Zero-Knowledge Proof . . .');
        try {
          const {proof,publicSignals} = await generateZKP(voterData,vote);
          setStatus('Proof generated. Submitting transaction . . .');
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const votingContract = new ethers.Contract(contractAddress,VotingContract.abi,signer);

          const tx = await votingContract.castVote(
            proof.pi_a,
            proof.pi_b,
            proof.pi_c,
            publicSignals,
            voterData.nullifier
          );
          setsStatus('Transaction sent: ${tx.hash}.Waiting for confirmation . . .');
          await tx.wait();
          setStatus('Vote successfully cast! Thank you for voting.');
        } catch(error) {
          setStatus('Error during voting: ${error.message}');
          console.error(error);
        }
    };
    return (
      <div style={appStyles.container}>
          <div style={appStyles.card}>
              <h1 style={appStyles.title}>CryptoTally</h1>
              <h2 style={appStyles.heading}>E-Voting System</h2>
              {!voterData ? (
                  <div>
                      <p>Enter your unique Voter ID to securely access the system.</p>
                      <input
                          type="text"
                          style={appStyles.input}
                          placeholder="e.g., voter123"
                          value={voterId}
                          onChange={(e) => setVoterId(e.target.value)}
                      />
                      <button style={appStyles.button} onClick={handleLogin}>Log In & Verify</button>
                  </div>
              ) : (
                  <div>
                      <p>Welcome, Voter {voterId}! Your eligibility has been confirmed. You may now cast your vote anonymously.</p>
                      <p style={appStyles.selection}>Select your candidate:</p>
                      <button style={appStyles.button} onClick={() => setVote('A')}>Candidate A</button>
                      <button style={appStyles.button} onClick={() => setVote('B')}>Candidate B</button>
                      <p style={appStyles.selection}>Your selection: <strong>{vote || 'None'}</strong></p>
                      <button style={appStyles.button} onClick={handleVote}>Cast Vote Anonymously</button>
                  </div>
              )}
              <p style={appStyles.status}>Status: {status}</p>
          </div>
      </div>
  );
};

export default App;
