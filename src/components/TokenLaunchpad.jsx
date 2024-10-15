const TokenLaunchpad = () => {
  return (
    <div
      style={{
        width: "35%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        marginTop: "10rem"
      }}
    >
      <h1>Solana Token Launchpad</h1>
      <input
        className="inputText"
        type="text"
        placeholder="Name"
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px",
          width: "100%"
        }}
      />
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Symbol"
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px",
          width: "100%"
        }}
      />
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Image URL"
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px",
          width: "100%"
        }}
      />
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Initial Supply"
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px",
          width: "100%"
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
          width: "100%"
        }}
      >
        Create a token
      </button>
    </div>
  );
};

export default TokenLaunchpad;