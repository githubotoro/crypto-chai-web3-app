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
			<div className="featured-on-producthunt">
				<center>
					<a
						href="https://www.producthunt.com/posts/crypto-chai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-crypto&#0045;chai"
						rel="noreferrer"
						target="_blank"
					>
						<img
							className="featured-image"
							src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=346958&theme=dark"
							alt="Crypto&#0032;Chai - Your&#0032;decentralized&#0032;&#0039;chai&#0039;&#0032;stall | Product Hunt"
						/>
					</a>
				</center>
			</div>
		</>
	);
};

export default Description;
