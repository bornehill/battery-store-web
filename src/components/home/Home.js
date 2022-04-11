import React from "react";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

export default () => {
	return (
		<React.Fragment>
			<Header />
			<main className="min-h-screen">
				<section className="bg-blue-900 text-white md:h-64">
					<div className="max-w-screen-xl mx-auto p-4">
						<h1 className="font-emphasis font-thin text-4xl md:text-5xl md:w-1/2">
							San Felipe Acumuladores
						</h1>
					</div>
				</section>
			</main>
			<Footer />
		</React.Fragment>
	);
};
