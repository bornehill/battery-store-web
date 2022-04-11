import React from "react";

const InputControl = ({ name, label, error, ...rest }) => {
	const hasError = error ? " has-error" : "";
	return (
		<div className={"input-control" + hasError}>
			<label htmlFor={name}>{label}</label>
			<input name={name} id={name} {...rest} />
			{error && <p className="text-sm text-red-700">{error}</p>}
		</div>
	);
};

export default InputControl;
