import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import { abi } from '../utils/WavePortal.json';
import Button from "./Button";

export default function App() {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [currAcnt, setCurrAcnt] = useState("");
  const [cnt, setCnt] = useState(0);
  const [msg, setMsg] = useState("");
  const [maxWallet, setMaxWallet] = useState("");
  const [hide, setHide] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = '0x1439491266D7811FbE37BB4BB933BF09E33e97B8';
  const contractABI = abi;

  useEffect(() => {
    if (isButtonLoading) {
      setTimeout(() => {
        setIsButtonLoading(false);
      }, 23000);
    }
  }, [isButtonLoading]);
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if(!ethereum) {
        console.log("Make sure you have Metamask!");
        return;
      } else {
        console.log("Connected!", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrAcnt(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getAllWaves();
  }, [])
  // Implement connectWallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if(!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrAcnt(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

// GetAllWaves Method
const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

// Wave Method
  const wave = async (msg) => {
    try {
      const { ethereum } = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(msg);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);
        count = await wavePortalContract.getTotalWaves();
        setCnt(count.toNumber());
        console.log("Retrieved total wave count...", count.toNumber());
        const [mW] = await wavePortalContract.getMaxWaves();
        setMaxWallet(mW);
        setHide(mW);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleTextChange = (event) => {
    setMsg(event.target.value);
  }
  
  return (
    <>
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <h1 data-shadow='Hi!'>Hi!</h1>
        </div>

        <div className="bio">
        I am Abhijit and am currently exploring the Web3 world! Connect your Ethereum wallet and wave at me!
        </div>
        <div>
          <input class = "inp" type = "text" placeholder = "Enter your message" onChange = {handleTextChange} />
        </div>
        <Button isLoading={isButtonLoading} onClick={() => {setIsButtonLoading(true); wave(msg);}}>
          Wave at Me
        </Button>
        {/*
        * If there is no currentAccount render this button
        */}
        {!currAcnt && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {hide && (
        <div className="dataContainer">
          <div className="bio">
            Waves received : {cnt} 🔥
          </div>
          <div className="bio">
            User {maxWallet} waved the most!
          </div>
        </div>
        )}
        {hide && allWaves.map((wave, index) => {
          return (
            <div key={index} className='sketchy'>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
    <div className="mainContainer">
        <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 600" xmlns="http://www.w3.org/2000/svg" class="transition duration-300 ease-in-out delay-150"><path d="M 0,600 C 0,600 0,200 0,200 C 111.24401913875596,182.9377990430622 222.48803827751192,165.8755980861244 329,156 C 435.5119617224881,146.1244019138756 537.2918660287082,143.4354066985646 629,169 C 720.7081339712918,194.5645933014354 802.3444976076554,248.38277511961718 900,265 C 997.6555023923446,281.6172248803828 1111.33014354067,261.03349282296654 1204,244 C 1296.66985645933,226.96650717703346 1368.334928229665,213.48325358851673 1440,200 C 1440,200 1440,600 1440,600 Z" stroke="none" stroke-width="0" fill="#ff008088" class="transition-all duration-300 ease-in-out delay-150 path-0"></path><path d="M 0,600 C 0,600 0,400 0,400 C 98.01913875598089,376.38277511961724 196.03827751196178,352.76555023923447 282,376 C 367.9617224880382,399.23444976076553 441.86602870813397,469.32057416267935 539,465 C 636.133971291866,460.67942583732065 756.4976076555025,381.95215311004785 855,372 C 953.5023923444975,362.04784688995215 1030.1435406698565,420.8708133971292 1124,437 C 1217.8564593301435,453.1291866028708 1328.9282296650717,426.56459330143537 1440,400 C 1440,400 1440,600 1440,600 Z" stroke="none" stroke-width="0" fill="#ff0080ff" class="transition-all duration-300 ease-in-out delay-150 path-1"></path></svg>
    </div>
    </>
  );
}
