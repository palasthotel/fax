import React from "react";
import {Link} from "react-router-dom";

const Footer = () => (
		<footer className="uk-background-secondary uk-light">
			<div className="uk-container uk-padding">
				<p>
					Brought to you by <Link to="https://ze.tt">ze.tt</Link> and{" "}
					<Link to="https://palasthotel.de">Palasthotel</Link> - Need help?{" "}
					<a href="mailto:fax-support@ze.tt">fax-support@ze.tt</a> - <a href="/privacy-policy.html">
						Privacy Policy
					</a>
				</p>
			</div>
		</footer>
);

export default Footer;
