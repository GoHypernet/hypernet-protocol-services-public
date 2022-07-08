import { makeStyles } from "@material-ui/core";
import { colors } from "@sharedComponents/theme";

export const useStyles = makeStyles((theme) => ({
	wrapper: (props: any) => ({
		width: "100%",
		display: "flex",
		flexDirection: "column",
	}),
	title: {
		marginBottom: 4,
		color: colors.GRAY400,
	},
	value: {
		marginBottom: 16,
		overflowWrap: "anywhere",
	},
}));
