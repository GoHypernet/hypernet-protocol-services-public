import { makeStyles } from "@material-ui/core";
import { colors } from "@sharedComponents/theme";

export const useStyles = makeStyles((theme) => ({
	wrapper: {
		borderRadius: 12,
		border: `1px solid ${colors.GRAY100}`,
		backgroundColor: colors.WHITE,
	},
	bodyWithHeader: {
		padding: "16px",
	},
	bodyWithoutHeader: {
		padding: 16,
	},
}));
