import "./Description.css";
import CryptoChaiImg from "../../Images/crypto-chai-illustration.svg";

const Description = () => {
	return (
		<>
			<div className="description-container">
				<img
					className="crypto-chai-img"
					src={CryptoChaiImg}
					alt=""
				></img>
			</div>
			<div className="title-container">
				<div className="title">CRYPTO CHAI</div>
				<div className="subtitle">
					Your Decentralized "Chai Ki Tapri"
				</div>
			</div>
		</>
	);
};

export default Description;
