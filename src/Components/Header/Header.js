import "./Header.css";

const Header = () => {
	return (
		<>
			<div className="container">
				<div className="background">
					<div className="links">
						<a
							href="https://github.com/githubotoro/crypto-chai-web3-app"
							rel="noreferrer"
							target="_blank"
						>
							GitHub
						</a>
						<a
							href="https://twitter.com/yupuday"
							rel="noreferrer"
							target="_blank"
						>
							Developer
						</a>
						<a
							href="https://mumbai.polygonscan.com/address/0x70856254B2bEc0c6B0a591554bbbbea7b40389EB#code"
							rel="noreferrer"
							target="_blank"
						>
							Smart Contract
						</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default Header;
