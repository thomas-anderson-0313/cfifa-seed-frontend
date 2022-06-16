import React, { useEffect, useState } from "react";
import { Navbar } from "react-bootstrap";
import { Button } from "@material-ui/core";
import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";

import Logo from "./img/logo.png";

function Header() {
  const [flag, setFlag] = useState(false);
  const [wallet, setWallet] = useState("");

  //   function handleChainChanged(_chainId) {
  //     // We recommend reloading the page, unless you must do otherwise
  //     window.location.reload();
  //   }

  //   function handleAccountsChanged(accounts) {
  //     if (accounts.length === 0) {
  //       // MetaMask is locked or the user has not connected any accounts
  //       console.log("Please connect to MetaMask.");
  //     }
  //     window.location.reload();
  //   }

  useEffect(() => {
    const refreshWallet = async () => {
      if (typeof window !== "undefined") {
        if (window.ethereum) {
          const account = window.sessionStorage.getItem("address");
          if (account) {
            const chainId = await window.ethereum.request({
              method: "eth_chainId",
            });
            if (!flag && chainId === "0x38")
              window.ethereum
                .enable()
                .then(async (res) => {
                  window.sessionStorage.setItem("address", res[0]);
                  setWallet(res[0]);
                  setFlag(true);
                  window.sessionStorage.setItem("connected", "true");
                })
                .catch((err) => {
                  setFlag(false);
                  window.sessionStorage.removeItem("address");
                  window.sessionStorage.removeItem("connected");
                  window.sessionStorage.removeItem("balance");
                  window.location.reload();
                });
          }
        }
      }
    };
    refreshWallet();
  }, [flag]);

  const handleConnect = async () => {
    if (typeof window !== "undefined") {
      if (window.ethereum) {
        console.log("Exsist metamask");
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (!flag && chainId === "0x38")
          window.ethereum
            .enable()
            .then(async (res) => {
              window.sessionStorage.setItem("address", res[0]);
              setWallet(res[0]);
              setFlag(true);
              window.sessionStorage.setItem("connected", "true");
              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const balance = await provider.getBalance(res[0]);
              const bal = ethers.utils.formatEther(balance);
              window.sessionStorage.setItem("balance", bal);
              //   window.location.reload();
              if (res) {
                NotificationManager.success(
                  "Connected Metamask successfully.",
                  "Success",
                  3000
                );
              }
            })
            .catch((err) => {
              NotificationManager.error(err.message, "Error", 3000);
              setFlag(false);
              window.sessionStorage.removeItem("address");
              window.sessionStorage.removeItem("connected");
              window.sessionStorage.removeItem("balance");
              window.location.reload();
            });
        if (chainId !== "0x38") {
          NotificationManager.warning(
            "Please change network to BSC main net.",
            "Action required",
            3000
          );
        }
      } else {
        NotificationManager.warning(
          "You must install metamask.",
          "Action required",
          3000
        );
      }
    }
  };
  return (
    <div className="x-nav-container">
      <div className="diceGrid">
        <Navbar.Brand href="/">
          <img src={Logo} alt="logo" width="120px" />
        </Navbar.Brand>
        <Button
          variant="contained"
          className="x-nav-button"
          onClick={handleConnect}
        >
          {flag ? wallet.slice(0, 4) + "..." + wallet.slice(-3) : "connect"}
        </Button>
      </div>
    </div>
  );
}

export default Header;
