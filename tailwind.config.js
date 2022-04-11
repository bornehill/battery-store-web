const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
	},
	purge: ["src/**/*.js", "src/**/*.jsx", "public/**/*.html"],
	theme: {
		fontFamily: {
			emphasis: ["Source Sans Pro", "sans-serif"],
			body: ["Source Sans Pro", "sans-serif"],
		},
		colors: {
			black: colors.black,
			white: colors.white,
			gray: colors.gray,
			red: colors.red,
			yellow: colors.yellow,
			green: colors.green,
			blue: colors.blue,
			teal: colors.teal,
		},
		extend: {
			colors: {
				flame: {
					100: "#ffd2c2",
					200: "#ffb499",
					300: "#ff9670",
					400: "#ff7847",
					500: "#ff5a1f",
					600: "#e53d00",
					700: "#cc3600",
					800: "#a32c00",
					900: "#7a2100",
				},
				onyx: {
					100: "#b7b7b8",
					200: "#a2a2a4",
					300: "#8e8e90",
					400: "#79797c",
					500: "#656567",
					600: "#515152",
					700: "#39393a",
					800: "#282829",
					900: "#141415",
				},
				light: "#fcfff7",
			},
		},
	},
	variants: {},
	plugins: [],
};
