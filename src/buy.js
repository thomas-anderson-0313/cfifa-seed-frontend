import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";

import CFIFA_coin from "./img/i_2.png";
import Couple_coin from "./img/i_2.png";

function Seedsale() {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState("");
  const [balance, setBalance] = useState("0");
  const [sold, setSold] = useState(0);

  useEffect(() => {
    const getSoldAmount = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(
        "0x12abadE41b975737e6997365CB4c68Ea36d4c999"
      );
      const bal = ethers.utils.formatEther(balance);
      setSold(bal);
    };
    getSoldAmount();

    if (window.sessionStorage.getItem("balance")) {
      const bal = window.sessionStorage.getItem("balance");
      setBalance(Number(bal).toFixed(4));
    } else {
      setBalance(0);
    }
  }, [from]);

  const handleBuy = async () => {
    if (typeof window !== "undefined") {
      if (window.ethereum) {
        const accounts = await window.ethereum.selectedAddress;
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setFrom(accounts);
        if (chainId === "0x38" && accounts) {
          if (amount < 0.2) {
            NotificationManager.warning(
              "Minimum allocation error",
              "Warning",
              3000
            );
            return;
          }
          if (amount > balance) {
            NotificationManager.error(
              "Insufficient funds error",
              "Error",
              3000
            );
            return;
          }
          sendBNB();
        } else {
          NotificationManager.error("Connect Metamask !", "Error", 3000);
          return;
        }
      }
    }
  };

  const sendBNB = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(from);
    const bal = ethers.utils.formatEther(balance);
    setBalance(bal);
    // await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log(
      "amount:",
      amount,
      "from:",
      from,
      "to:",
      "0x12abadE41b975737e6997365CB4c68Ea36d4c999"
    );
    //send bnb
    signer
      .sendTransaction({
        value: ethers.utils.parseUnits(amount),
        to: "0x12abadE41b975737e6997365CB4c68Ea36d4c999",
      })
      .then((res) => {
        if (res) {
          NotificationManager.success(
            "Transaction successfully submitted!",
            "Thanks",
            3000
          );
        }
      })
      .catch((err) => {
        NotificationManager.error(err.message, "Error", 3000);
      });
  };

  const handleAmount = async (e) => {
    setAmount(e.target.value);
  };
  return (
    <div>
      <div className="diceGrid1">
        <Grid container>
          <Grid item xs={12} sm={1} md={1} lg={2}></Grid>
          <Grid item xs={12} sm={10} md={10} lg={8}>
            <Grid container>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <h1 className="blog-graphic-text">
                  CFIFA is the great innovation online FIFA.
                </h1>
                <img
                  src={Couple_coin}
                  alt="couple_coin"
                  style={{ marginTop: "50px" }}
                  width="70%"
                />
                <div style={{ marginTop: 50, marginBottom: 50 }}>
                  <Grid container>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <div>
                        <a
                          className="marketing-button"
                          href="https://crypto-fifa23.gitbook.io/crypto-fifa23-world/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Whitepaper
                        </a>
                      </div>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <div>
                        <a
                          className="marketing-button"
                          href="https://t.me/cfifa_official"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Telegram
                        </a>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <div className="y-card-form-top">
                  <div className="x-font3_2 text-center top_section">
                    <span>CFIFA Seedround Sale</span>
                    <img src={CFIFA_coin} alt="CFIFA-coin"></img>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div className="mt-3 bottom_border">
                      <span className="x-font3_1">Your balance:</span>
                      <span className="x-font3 float-right">
                        {balance}
                        <span style={{ color: "#2f2cd1" }}> BNB</span>
                      </span>
                    </div>
                    <div className="mt-3 bottom_border">
                      <span className="x-font3_1">Amount in BNB:</span>
                      <input
                        type="number"
                        className="y-card-input"
                        style={{ textAlign: "right" }}
                        onChange={handleAmount}
                        value={amount}
                      />
                    </div>
                    <div className="mt-3 bottom_border">
                      <span className="x-font3_1">You will receive:</span>
                      <span className="x-font3 float-right">
                        {5500 * amount}{" "}
                        <span style={{ color: "#e31e2d" }}>CFIFA</span>
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "85%",
                      marginLeft: "5%",
                      marginTop: "15px",
                    }}
                  >
                    <Progress percent={(sold / 42.5).toFixed(4)} />
                  </div>
                  <div style={{ textAlign: "center", color: "white" }}>
                    {sold} BNB
                  </div>
                  <div className="sale-infor">
                    <div>25,000,000 CFIFA for Seedsale</div>
                    <div>Total Cap: 2,000/4,250 BNB</div>
                    <div>1 BNB is 5,500 CFIFA</div>
                    <div>Min Allocation: 0.2 BNB</div>
                  </div>
                  <div className="mt-1 text-center">
                    <button
                      className="x-swapCard-submit-button"
                      style={{ padding: 14, width: "50%", marginTop: 20 }}
                      onClick={handleBuy}
                      disabled
                    >
                      Buy CFIFA
                    </button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={1} md={1} lg={2}></Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Seedsale;
