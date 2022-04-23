export function mapEnumToDropdown(enumType) {
	return [
		{ value: "", text: "Seleccionar" },
		...Object.keys(enumType).map((typeValue) => {
			return {
				value: typeValue,
				text: enumType[typeValue],
			};
		}),
	];
}

export function mapEnumIndexToDropdown(enumType) {
	return Object.keys(enumType).map((typeValue, index) => {
		return {
			value: index,
			text: enumType[typeValue],
		};
	});
}

export function mapListToDropdown(list, valueIndex, textIndex) {
	return list.map((l) => {
		return {
			value: l[valueIndex],
			text: l[textIndex],
		};
	});
}
