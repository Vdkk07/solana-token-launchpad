import {
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

const TokenLaunchpad = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  async function createToken() {
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const keypair = Keypair.generate();

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: keypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        keypair.publicKey,
        9,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_PROGRAM_ID
      )
    );

    const recentBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = recentBlockhash.blockhash;
    transaction.feePayer = wallet.publicKey;

    transaction.partialSign(keypair);

    let response = await wallet.sendTransaction(transaction, connection);
    console.log(response);
  }

  return (
    <div
      style={{
        width: "35%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        marginTop: "10rem",
      }}
    >
      <h1>Solana Token Launchpad</h1>
      <input
        className="inputText"
        type="text"
        id="name"
        placeholder="Name"
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px",
          width: "100%",
        }}
      />
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Symbol"
        id="symbol"
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px",
          width: "100%",
        }}
      />
      <br />
      <input
        className="inputText"
        type="text"
        id="imageURL"
        placeholder="Image URL"
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px",
          width: "100%",
        }}
      />
      <br />
      <input
        className="inputText"
        type="text"
        id="initialSupply"
        placeholder="Initial Supply"
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px",
          width: "100%",
        }}
      />
      <br />
      <button
        className="btn"
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#4CAF50",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
          width: "100%",
        }}
        onClick={createToken}
      >
        Create a token
      </button>
    </div>
  );
};

export default TokenLaunchpad;
