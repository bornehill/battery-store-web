import React from "react";

const SelectControl = ({ name, label, value, options, error, ...rest }) => {
	const hasError = error ? " has-error" : "";
	return (
		<div className={"input-control" + hasError}>
			<label htmlFor={name}>{label}</label>
			<select name={name} value={value} {...rest}>
				{options.map((option) => {
					return (
						<option key={option.value} value={option.value}>
							{option.text}
						</option>
					);
				})}
			</select>
			{error && <p className="text-sm text-red-700">{error}</p>}
		</div>
	);
};

export default SelectControl;
