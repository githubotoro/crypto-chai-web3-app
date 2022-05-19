import "./Working.css";
import abi from "../../Utils/CryptoChai.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { networks } from "../../Utils/networks";
import Swal from "sweetalert2";

const Working = () => {
	const contractAddress = "0x70856254B2bEc0c6B0a591554bbbbea7b40389EB";
	const contractABI = abi.abi;

	// Declaring States
	const [currentAccount, setCurrentAccount] = useState("");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [memos, setMemos] = useState([]);
	const [owner, setOwner] = useState("");
	const [ownerName, setOwnerName] = useState("");
	const [chais, setChais] = useState(0);
	const [network, setNetwork] = useState("");

	// Function to switch network
	const switchNetwork = async () => {
		if (window.ethereum) {
			try {
				// Trying to switch to the mumbai testnet
				await window.ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: "0x13881" }], // Checking networks.js for hexadecimal network ids
				});
			} catch (error) {
				// This error code means that the chain we want has not been added to MetaMask
				// In this case we ask the user to add it to their MetaMask
				if (error.code === 4902) {
					try {
						await window.ethereum.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: "0x13881",
									chainName: "Polygon Mumbai Testnet",
									rpcUrls: [
										"https://rpc-mumbai.maticvigil.com/",
									],
									nativeCurrency: {
										name: "Mumbai Matic",
										symbol: "MATIC",
										decimals: 18,
									},
									blockExplorerUrls: [
										"https://mumbai.polygonscan.com/",
									],
								},
							],
						});
					} catch (error) {
						console.log(error);
					}
				}
				console.log(error);
			}
		} else {
			// If window.ethereum is not found then MetaMask is not installed
			alert(
				"MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
			);
		}
	};

	// Setting initial variables
	const setInitialVariables = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(
					ethereum,
					"any"
				);
				const signer = provider.getSigner();
				const cryptoChai = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let totalChaisPromise = cryptoChai.chais();

				totalChaisPromise.then(function (result) {
					let totalChais = result.toNumber();
					setChais(totalChais);
					console.log(`Total Chais served till now: ${totalChais}`);
				});

				let ownerPromise = cryptoChai.owner();

				ownerPromise.then(function (result) {
					let owner = result.toString();
					setOwner(owner);
					console.log(`Owner of Crypto Chai is: ${owner}`);
				});

				let ownerNamePromise = cryptoChai.ownerName();

				ownerNamePromise.then(function (result) {
					let ownerName = result.toString();
					setOwnerName(ownerName);
					console.log(`Name of Crypto Chai Owner is: ${ownerName}`);
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Setting initial variables on getting user
	useEffect(() => {
		setInitialVariables();
	}, [currentAccount]);

	// Changing name
	const onNameChange = (event) => {
		setName(event.target.value);
	};

	// Changing message
	const onMessageChange = (event) => {
		setMessage(event.target.value);
	};

	// Checking if wallet is connected
	const isWalletConnected = async () => {
		const { ethereum } = window;

		const accounts = await ethereum.request({ method: "eth_accounts" });
		console.log("accounts: ", accounts);

		if (accounts.length > 0) {
			const account = accounts[0];
			console.log("wallet is connected! " + account);
		} else {
			console.log("make sure MetaMask is connected");
		}

		// Checking chain ID
		const chainId = await ethereum.request({ method: "eth_chainId" });
		setNetwork(networks[chainId]);

		ethereum.on("chainChanged", handleChainChanged);

		// Reloading the page after chain change
		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	};

	// Connecting to Wallet
	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log("Please install MetaMask");
			}

			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	};

	// Function to Buy Chai
	const buyChai = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(
					ethereum,
					"any"
				);
				const signer = provider.getSigner();
				const buyAChai = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);
				Swal.fire({
					position: "center",
					icon: "info",
					title: "Confirm the MetaMask Transaction for buying Chai! 👀",
					showConfirmButton: false,
					timer: 4000,
				});

				console.log("Buying a Chai...");
				const chaiTxn = await buyAChai.buyChai(
					name ? name : "Anonymous",
					message ? message : "Chai and Chill!",
					{ value: ethers.utils.parseEther("0.0001") }
				);

				Swal.fire({
					position: "center",
					icon: "info",
					title: "Buying Chai!\n This might take a few minutes.\n Please wait... ⏳",
					showConfirmButton: true,
				});

				await chaiTxn.wait();

				Swal.fire({
					position: "center",
					icon: "success",
					title: `<strong>Yaayyy!</strong> 🎉 <br/> "CHAI" has been bought! ✅ <br/><strong>You are officially the owner of "Crypto Chai" ☕</strong> `,
					showConfirmButton: true,
				});

				console.log("Transaction Hash: ", chaiTxn.hash);

				console.log("Bought Chai!");

				// Clear the form fields.
				setName("");
				setMessage("");

				setInitialVariables();
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Function to fetch all memos stored on-chain.
	const getMemos = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const CryptoChai = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				setInitialVariables();

				console.log("Fetching Memos from the Polygon...");
				const memos = await CryptoChai.getMemos();
				console.log("Memos have been fetched!");
				setMemos(memos);
			} else {
				console.log("Metamask is not connected");
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Checking connection
	useEffect(() => {
		isWalletConnected();
		connectWallet();
	}, [currentAccount]);

	// Function to render information
	const HowItWorksAndOwner = () => {
		return (
			<>
				<div className="working-container">
					<div className="working-box" id="work-box">
						<div className="working-title">How it works?</div>
						<div className="working-content">
							1. You buy someone a "CHAI"
							<br></br>
							2. Someone buys you a "CHAI" <br></br>
							<hr />
							<em>Keep that "CHAI" loop going...</em>
						</div>
					</div>

					<div className="working-box" id="work-box">
						<div className="working-title">Current Owner</div>
						<div className="working-content">
							<div className="owner-details">
								<center>
									<div className="owner-username">
										{ownerName}
									</div>

									<div className="owner-address">{owner}</div>
									<hr />

									<div className="buy-chai">
										<em>
											Become the new owner by buying a
											"CHAI"
										</em>
									</div>
								</center>
							</div>
						</div>
					</div>
				</div>

				<div className="working-container">
					<div className="working-box info-box " id="work-box">
						<div className="chais-served">
							<div className="working-title">
								Chais Served : {chais}
							</div>
						</div>
					</div>
				</div>

				<div className="working-container">
					<div className="working-box info-box " id="work-box">
						<div className="working-title">Chai and Chill</div>
						<div className="working-content">
							Crypto Chai is the &nbsp;
							<span className="highlighted-text">
								decentralized
							</span>
							&nbsp; "CHAI" stop .
							<br />
							Whenever someone buys a "CHAI", they{" "}
							<span className="highlighted-text">
								become the owner
							</span>{" "}
							till someone buys a "CHAI" for them.
							<br />
							Thus,{" "}
							<span className="highlighted-text">
								everyone
							</span>{" "}
							can be the owner of "Crypto Chai", just by buying a
							"Chai".
							<hr />
							You can{" "}
							<span className="highlighted-text">
								DONATE
							</span>{" "}
							Mainnet MATIC on below address.
							<br />
							Once we have sufficient{" "}
							<span className="highlighted-text">
								community support
							</span>
							, "Crypto Chai" would go live on{" "}
							<span className="highlighted-text">
								Polygon Mainnet.
							</span>
							<br />
							<span className="highlighted-text">
								0xD5a63CCE627372481b30AE24c31a3Fb94913D5Be
							</span>
						</div>
					</div>
				</div>

				<a
					href="https://faucet.polygon.technology/"
					target="_blank"
					rel="noreferrer"
					className="polygon-faucet"
				>
					<div className="faucet">
						<div className="working-container">
							<div
								className="working-box info-box "
								id="work-box"
							>
								<div className="working-title">
									Polygon Faucet
								</div>
								<div className="working-content">
									Don't have{" "}
									<span className="highlighted-text">
										MATIC{" "}
									</span>
									to buy "CHAI"?
									<br />
									Don't worry! You can get some for{" "}
									<span className="highlighted-text">
										free
									</span>{" "}
									from Polygon Faucet.
									<br />
									<span className="highlighted-text">
										Click here
									</span>{" "}
									to go to Faucet!
								</div>
							</div>
						</div>
					</div>
				</a>
			</>
		);
	};

	// Handling submits
	const handleSubmit = (event) => {
		event.preventDefault();
	};

	// Function to render input form to user
	const renderInputForm = () => {
		return (
			<>
				<div className="connected-container">
					<form onSubmit={handleSubmit}>
						<div>
							<center>
								<label>Name</label>
							</center>

							<input
								id="name"
								type="text"
								placeholder="Anonymous "
								onChange={onNameChange}
							/>
						</div>
						<br />
						<div>
							<center>
								<label>Send a message</label>
							</center>

							<textarea
								rows={3}
								placeholder="Chai and Chill!"
								id="message"
								onChange={onMessageChange}
							></textarea>
						</div>
						<div>
							<div className="buy-chai">
								<div className="connection-container">
									<div className="connect-wallet-button">
										<button onClick={buyChai}>
											Buy Chai for 0.0001 MATIC
										</button>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>

				<HowItWorksAndOwner />
			</>
		);
	};

	// Function to render if wallet is not connected yet
	const renderNotConnectedContainer = () => (
		<div className="connection-container">
			<div className="connect-wallet-button">
				<button onClick={connectWallet}>Connect Wallet</button>
			</div>
		</div>
	);

	// Fetching memos
	useEffect(() => {
		let cryptoChai;
		isWalletConnected();
		getMemos();

		// Creating an event handler function for when someone sends a new memo
		const onNewMemo = (from, fromName, to, toName, message, timestamp) => {
			console.log(
				"Memo received: ",
				from,
				fromName,
				to,
				toName,
				message,
				timestamp
			);
			setMemos((prevState) => [
				...prevState,
				{
					from: from,
					fromName: fromName,
					to: to,
					toName: toName,
					timestamp: new Date(timestamp * 1000),
					message,
				},
			]);
		};

		const { ethereum } = window;

		// Listen for new memo events
		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum, "any");
			const signer = provider.getSigner();
			cryptoChai = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);

			cryptoChai.on("NewMemo", onNewMemo);
		}

		return () => {
			if (cryptoChai) {
				cryptoChai.off("NewMemo", onNewMemo);
			}
		};
	}, [currentAccount]);

	// Formatting timestamp
	const stylizeTimestamp = (timestamp) => {
		let date = new Date(timestamp * 1000);

		return date;
	};

	return (
		<>
			{network === "Polygon Mumbai Testnet" ? (
				<>
					{!currentAccount && renderNotConnectedContainer()}
					{currentAccount && renderInputForm()}

					<div className="memos-container">
						{currentAccount && (
							<div className="memos-received">Recent Serves!</div>
						)}

						{currentAccount &&
							memos.slice(-5).map((memo, idx) => {
								return (
									<div className="memo-container">
										<div
											className="memo-box"
											id="memo-box-id"
										>
											<div key={idx}>
												<p>
													<span className="highlighted-text-2">
														Message:
													</span>{" "}
													&nbsp; {memo.message}{" "}
												</p>

												<p>
													<span className="highlighted-text-2">
														From:{" "}
													</span>
													&nbsp; {memo.fromName}{" "}
													&nbsp;(
													{memo.from})
												</p>
												<p>
													<span className="highlighted-text-2">
														To:
													</span>
													&nbsp;{memo.toName} &nbsp; (
													{memo.to})
												</p>
												<p>
													<span className="highlighted-text-2">
														Time:
													</span>{" "}
													&nbsp;
													{stylizeTimestamp(
														memo.timestamp
													).toString()}
												</p>
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</>
			) : (
				<>
					{currentAccount ? (
						<>
							<div className="switch-to-polygon-container">
								<div className="switch-to-polygon">
									Please switch to Polygon Mumbai Testnet.
								</div>
							</div>

							<div className="switch-button">
								<button onClick={switchNetwork}>
									Click here to Switch!
								</button>
							</div>
						</>
					) : (
						renderNotConnectedContainer()
					)}
				</>
			)}
		</>
	);
};

export default Working;
