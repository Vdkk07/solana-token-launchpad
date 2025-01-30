import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";

const TokenLaunchpadWithMetadataMint = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  async function createToken() {
    const mintKeypair = Keypair.generate();
    const metadata = {
      mint: mintKeypair.publicKey,
      name: "Vedik",
      symbol: "VDK",
      uri: "https://tan-wrong-whitefish-958.mypinata.cloud/ipfs/Qmf3KeF8bKo1nQ7UVuPjAX8BP3kQYcDBSTCtZVH6s8qFBG",
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

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(mintKeypair);

    const response = await wallet.sendTransaction(transaction, connection);

    console.log(response);
    console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

    const associatedToken = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
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

    const response2 = await wallet.sendTransaction(transaction2, connection);
    console.log(response2);

    const transaction3 = new Transaction().add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedToken,
        wallet.publicKey,
        BigInt(1000000000000),
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    const respone3 = await wallet.sendTransaction(transaction3, connection);
    console.log(respone3);
    console.log("Minted");
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Solana Token Launchpad</h1>
      <input className="inputText" type="text" placeholder="Name"></input>{" "}
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Symbol"
      ></input>{" "}
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Image URL"
      ></input>{" "}
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Initial Supply"
      ></input>{" "}
      <br />
      <button onClick={createToken} className="btn">
        Create a token
      </button>
    </div>
  );
};

export default TokenLaunchpadWithMetadataMint;
