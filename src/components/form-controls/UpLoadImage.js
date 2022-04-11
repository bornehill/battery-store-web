import React, { useState } from "react";

import InputControl from "../form-controls/InputControl";

const UpLoadImage = ({
	name,
	label,
	error,
	disabled,
	handleValues,
	imgSize,
	...rest
}) => {
	const [file, setFile] = useState("");
	const [imagePreview, setImagePreview] = useState("");
	const [base64, setBase64] = useState("");
	const [fileName, setFileName] = useState("");
	const [size, setSize] = useState(imgSize);

	const parseImage = (file) => {
		if (file) {
			const reader = new FileReader();
			reader.onload = handleReaderLoaded;
			reader.readAsBinaryString(file);
		}
	};

	const handleReaderLoaded = (readerEvt) => {
		let binaryString = readerEvt.target.result;
		const imageStr = btoa(binaryString);
		setBase64(imageStr);
		handleValues(name, imageStr, readerEvt.total);
	};

	const photoUpload = (e) => {
		e.preventDefault();
		const reader = new FileReader();
		const file = e.target.files[0];
		if (reader !== undefined && file !== undefined) {
			reader.onloadend = () => {
				setFile(file);
				setSize(file.size);
				setFileName(file.name);
				setImagePreview(reader.result);
				parseImage(file);
			};
			reader.readAsDataURL(file);
		}
	};

	const remove = () => {
		setFile("");
		setImagePreview("");
		setBase64("");
		setFileName("");
		setSize("");
		handleValues(name, "", 0);
	};

	const hasError = error ? " has-error" : "";
	return (
		<div className={"input-control" + hasError}>
			<InputControl
				type="file"
				name={name}
				label={label}
				id={name}
				accept=".jpef, .png, .jpg"
				onChange={photoUpload}
				src={imagePreview}
				defaultValue={fileName}
				error={error}
				disabled={disabled}
				{...rest}
			/>

			{!!size && (
				<div>
					<section>
						<div>
							<label>Size: </label>
							<span>{(size / 1024).toFixed(2)} Kb</span>
						</div>
					</section>
					<button className="btn btn-link" type="button" onClick={remove}>
						Remove
					</button>
				</div>
			)}
		</div>
	);
};

export default UpLoadImage;
