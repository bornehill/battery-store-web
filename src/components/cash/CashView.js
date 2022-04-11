import React, { useState } from "react";
import CashForm from "./CashForm";
import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";

const CashView = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	const handleSuccess = () => {};

	const handleError = (error) => {
		setErrorMessage(error);
	};

	const handleLoading = (loading) => {
		setIsLoading(loading);

		if (isLoading) {
			setErrorMessage(null);
		}
	};

	return (
		<React.Fragment>
			<Header />
			<main>
				<div className="w-full h-screen card card-white md:max-w-md md:rounded-sm md:mx-auto md:h-auto relative">
					{isLoading && <LoadingBar />}
					{errorMessage && (
						<p className="mt-2 text-sm p-2 text-white bg-red-700">
							{{ errorMessage }}
						</p>
					)}
					<CashForm
						onSuccess={handleSuccess}
						onError={handleError}
						onLoading={handleLoading}
					/>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default CashView;
