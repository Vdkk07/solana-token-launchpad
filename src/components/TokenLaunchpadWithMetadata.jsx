import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  TOKEN_2022_PROGRAM_ID,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
const TokenLaunchpadWithMetadata = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  async function createToken() {
    const name = document.getElementById("name").value;
    const symbol = document.getElementById("symbol").value;
    const imageURL = document.getElementById("imageURL").value;
    const initialSupply = document.getElementById("initialSupply").value;

    const mintKeypair = Keypair.generate();

    const metadata = {
      mint: mintKeypair.publicKey,
      name: name,
      symbol: symbol,
      initialSupply: initialSupply,
      image: imageURL,
      uri: "https://ipfs.io/ipfs/Qmf3KeF8bKo1nQ7UVuPjAX8BP3kQYcDBSTCtZVH6s8qFBG",
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);

    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        wallet.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintKeypair.publicKey,
        metadata: mintKeypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
      })
    );

    const recentBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = recentBlockhash.blockhash;
    transaction.feePayer = wallet.publicKey;

    transaction.partialSign(mintKeypair);

    await wallet.sendTransaction(transaction, connection);

    console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

    // ATA
    const associatedToken = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(`ATA created at ${associatedToken.toBase58()}`);

    const transaction2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedToken,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(transaction2, connection);

    const transaction3 = new Transaction().add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedToken,
        wallet.publicKey,
        initialSupply * LAMPORTS_PER_SOL,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(transaction3, connection);

    console.log("Minted!");
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

export default TokenLaunchpadWithMetadata;
