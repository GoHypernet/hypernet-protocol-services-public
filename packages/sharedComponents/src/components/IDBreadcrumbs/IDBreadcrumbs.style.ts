import { makeStyles } from "@material-ui/core";
import { colors } from "@sharedComponents/theme";

export const useStyles = makeStyles((theme) => ({
	wrapper: {
		marginBottom: 16,
	},
	link: {
		color: colors.GRAY300,
		textDecoration: "none",
		display: "flex",
		alignItems: "baseline",
	},
	iconWrapper: {
		marginRight: 8,
	},
}));
