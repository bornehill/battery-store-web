import React, { useState } from "react";

export default ({
	page,
	setPage,
	elements,
	elementsByPage,
	dispatchUpdateView,
}) => {
	const [disableBack, setDisableBack] = useState(true);
	const [disableNext, setDisableNext] = useState(false);

	const handleBack = () => {
		if (page > 1) {
			const pageBack = page - 1;
			const end = pageBack * elementsByPage;
			const view = elements.slice(end - elementsByPage, end);
			dispatchUpdateView(view);
			setPage(pageBack);
			if (disableNext) setDisableNext(false);
			if (end === elementsByPage) setDisableBack(true);
		} else {
			setDisableBack(true);
			setDisableNext(false);
		}
	};

	const handleNext = () => {
		if (page * elementsByPage < elements.length) {
			const nextPage = page + 1;
			const end =
				nextPage * elementsByPage <= elements.length
					? nextPage * elementsByPage
					: elements.length;
			const view = elements.slice(page * elementsByPage, end);
			dispatchUpdateView(view);
			setPage(nextPage);
			if (disableBack) setDisableBack(false);
			if (nextPage * elementsByPage >= elements.length) setDisableNext(true);
		} else {
			setDisableNext(true);
			setDisableBack(false);
		}
	};

	return (
		<div className="flex  justify-between w-2/4">
			<button
				className="btn btn-tertiary cursor-pointer font-bold"
				type="button"
				onClick={handleBack}
				disabled={disableBack}
			>
				Regresar
			</button>
			<button
				className="btn btn-tertiary cursor-pointer font-bold"
				type="button"
				onClick={handleNext}
				disabled={disableNext}
			>
				Siguiente
			</button>
		</div>
	);
};
