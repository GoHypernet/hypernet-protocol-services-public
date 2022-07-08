import { makeStyles } from "@material-ui/core";
import { EFontSize, colors } from "@sharedComponents/theme";

export const useStyles = makeStyles((theme) => ({
	label: {
		fontSize: EFontSize.LABEL,
	},
	link: {
		fontSize: EFontSize.LINK,
	},
	subtitle2: {
		fontSize: EFontSize.SUBTITLE2,
	},
}));
