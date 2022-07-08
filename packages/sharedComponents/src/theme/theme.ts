import {
	responsiveFontSizes,
	createTheme,
	ThemeProvider as MuiThemeProvider,
} from "@material-ui/core";

export const colors = {
	WHITE: "#FFFFFF",
	BLACK: "#000000",
	STATUS_GREEN: "#00C3A9",
	STATUS_RED: "#D32F2F",
	STATUS_BLUE: "#0078FF",
	BACKGROUND_GREY: "#F9F9F9",
	MAIN_TEXT_BLACK: "#1D1D1D",
	BOX_BORDER_COLOR: "#F6F6F6",
	STATUS_GREY: "#676767",

	PRIMARY: "#DE74E9",
	PRIMARYHOVER: "#C868D2",
	PRIMARYPRESSED: "#B45EBD",
	PRIMARYDISABLED: "#F8E3FB",

	SECONDARY: "#4EBFAB",

	GRAY0: "#FFFFFF",
	GRAY100: "#E8E7E7",
	GRAY200: "#D8D7D7",
	GRAY300: "#505050",
	GRAY400: "#000000",

	BLUE100: "#DEEBFF",
	BLUE200: "#B3D4FF",
	BLUE300: "#4C9AFF",
	BLUE400: "#0747A6",

	RED100: "#FFEBE6",
	RED200: "#FFBDAD",
	RED300: "#DE350B",
	RED400: "#BF2600",

	ORANGE100: "#FFFAE6",
	ORANGE200: "#FFE380",
	ORANGE300: "#FFAB00",
	ORANGE400: "#FF8B00",

	GREEN100: "#E3FCEF",
	GREEN200: "#ABF5D1",
	GREEN300: "#36B37E",
	GREEN400: "#006644",
};

export enum EStatusColor {
	IDLE = "IDLE",
	SUCCESS = "SUCCESS",
	DANGER = "DANGER",
	PRIMARY = "PRIMARY",
}

export enum EButtonStatus {
	primary,
	secondary,
	link,
}

export enum EFontWeight {
	LIGHT = 300,
	REGULAR = 400,
	MEDIUM = 500,
	SEMI_BOLD = 600,
	BOLD = 700,
}

export enum EFontSize {
	H1 = "2.645rem",
	H2 = "1.913rem",
	H3 = "1.476rem",
	SUBTITLE1 = "1.383rem",
	SUBTITLE2 = "1.296rem",
	BODY1 = "1rem",
	BODY2 = ".8789rem",
	BUTTON = "1rem",
	BASE = "1rem",
	LABEL = ".772rem",
	LINK = ".678rem",
	H4 = "1.125rem",
	H5 = "1rem",
	H6 = ".75rem",
	LARGE = "3.125rem",
	BUTTON_LARGE = "1rem",
	BUTTON_MEDIUM = ".889rem",
	BUTTON_SMALL = ".75rem",
}

export const getColorFromStatus = (status: EStatusColor) => {
	switch (status) {
		case EStatusColor.DANGER:
			return colors.STATUS_RED;

		case EStatusColor.PRIMARY:
			return colors.PRIMARY;

		case EStatusColor.SUCCESS:
			return colors.STATUS_GREEN;

		case EStatusColor.IDLE:
			return colors.STATUS_GREY;

		default:
			return colors.WHITE;
	}
};

const MuiTypography = {
	button: {
		textTransform: "none",
	},
};

const MuiCard = {
	root: {
		padding: 40,
		boxShadow: `inset 0 0 0 1px ${colors.GRAY200},
			0px 20px 10px rgba(0, 0, 0, 0.05)`,
	},
};

const MuiPaper = {
	rounded: {
		borderRadius: 12,
	},
};

const MuiButton = {
	root: {
		padding: "12px",
		fontSize: EFontSize.BUTTON_MEDIUM,
		textTransform: "none" as const,
		borderRadius: 24,
		maxHeight: "40px",
	},
	outlined: {
		padding: "12px",
	},
	containedPrimary: {
		"&:hover": {
			backgroundColor: colors.PRIMARYHOVER,
		},
	},
	text: {
		padding: "12px",
	},

	sizeSmall: {
		padding: "8px 12px",
		fontSize: EFontSize.BUTTON_SMALL,
	},
	outlinedSizeSmall: {
		padding: "8px 12px",
		fontSize: EFontSize.BUTTON_SMALL,
	},
	containedSizeSmall: {
		padding: "8px 12px",
		fontSize: EFontSize.BUTTON_SMALL,
	},

	sizeLarge: {
		fontSize: EFontSize.BUTTON_LARGE,
	},
	outlinedSizeLarge: {
		fontSize: EFontSize.BUTTON_LARGE,
	},
	containedSizeLarge: {
		fontSize: EFontSize.BUTTON_LARGE,
	},
};

const MuiButtonBase = {
	disableRipple: true,
	root: {
		fontSize: EFontSize.BUTTON,
		textTransform: "none",
	},
};

const MuiRadio = {
	root: {
		padding: 5,
	},
};

const MuiLink = {
	root: {
		cursor: "pointer",
	},
};

// GovernanceProgress applies height and backgroundColor inline.
const MuiLinearProgress = {
	root: {
		height: "inherit",
		borderRadius: 3,
		backgroundColor: colors.GRAY200,
	},
	barColorPrimary: {
		backgroundColor: "inherit",
	},
	bar: {
		borderRadius: 3,
	},
};

export const bodyFontFamily = `'Helvetica', 'Helvetica Neue', 'Arial', sans-serif`;
export const titleFontFamily = `'Fredoka One','Helvetica', 'Helvetica Neue', cursive`;

const typography = {
	fontFamily: bodyFontFamily,
	fontSize: 8,
	gutterBottom: 10,
	h1: {
		fontSize: EFontSize.H1,
		fontFamily: titleFontFamily,
		fontWeight: EFontWeight.REGULAR,
		color: colors.SECONDARY,
	},
	h2: {
		fontSize: EFontSize.H2,
		fontFamily: titleFontFamily,
		fontWeight: EFontWeight.REGULAR,
		color: colors.GRAY400,
	},
	h3: {
		fontSize: EFontSize.H3,
		fontFamily: bodyFontFamily,
		fontWeight: EFontWeight.BOLD,
		color: colors.GRAY400,
	},
	subtitle1: {
		fontSize: EFontSize.SUBTITLE1,
		fontWeight: EFontWeight.REGULAR,
		fontFamily: titleFontFamily,
		color: colors.GRAY300,
	},
	subtitle2: {
		fontSize: EFontSize.SUBTITLE2,
		fontWeight: EFontWeight.REGULAR,
		fontFamily: bodyFontFamily,
		color: colors.GRAY400,
	},
	h4: {
		fontSize: EFontSize.H4,
		fontFamily: bodyFontFamily,
	},
	h5: {
		fontSize: EFontSize.H5,
		fontFamily: bodyFontFamily,
	},
	h6: {
		fontSize: EFontSize.H6,
		fontFamily: bodyFontFamily,
	},
	body1: {
		fontSize: EFontSize.BODY1,
		fontFamily: bodyFontFamily,
		fontWeight: EFontWeight.REGULAR,
		color: colors.GRAY300,
	},
	body2: {
		fontSize: EFontSize.BODY2,
		fontFamily: bodyFontFamily,
		fontWeight: EFontWeight.REGULAR,
		color: colors.GRAY300,
	},
	button: {
		fontSize: EFontSize.BUTTON,
		fontFamily: bodyFontFamily,
		fontWeight: EFontWeight.REGULAR,
	},
};

const MuiChip = {
	root: {
		fontSize: EFontSize.BODY2,
	},
	sizeSmall: {
		height: 18,
	},
};

export const theme = createTheme({
	typography,
	palette: {
		primary: {
			main: colors.PRIMARY,
			contrastText: colors.WHITE,
		},
		text: {
			primary: colors.GRAY300,
			secondary: colors.GRAY400,
		},
		divider: colors.GRAY200,
	},
	overrides: {
		// @ts-ignore
		MuiTypography,
		MuiButton,
		MuiLinearProgress,
		MuiCard,
		MuiPaper,
		MuiRadio,
		MuiLink,
		MuiChip,
	},
	props: {
		MuiButtonBase,
	},
});

export const lightTheme = responsiveFontSizes(theme);

export const ThemeProvider = MuiThemeProvider;
