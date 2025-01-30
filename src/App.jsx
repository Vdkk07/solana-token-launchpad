import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import TokenLaunchpad from "./components/TokenLaunchpad";
import TokenLaunchpadWithMetadata from "./components/TokenLaunchpadWithMetadata";
import TokenLaunchpadWithMetadataMint from "./components/TokenLaunchpadWithMetadataMint";

const App = () => {
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div
            style={{
              width: "70%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "0  auto",
              marginTop: "3rem",
            }}
          >
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
         
          <div
            style={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "0  auto",
              marginTop: "2rem",
            }}
          >
            {/* <TokenLaunchpad></TokenLaunchpad> */}
            <TokenLaunchpadWithMetadata></TokenLaunchpadWithMetadata>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
