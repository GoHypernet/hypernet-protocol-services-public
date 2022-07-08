import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
	wrapper: (props) => {
		return {
			width: "100%",
			alignItems: "center",
		};
	},
	titleWrapper: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	topWrapper: {
		marginBottom: 24,
	},
	description: { marginTop: 8 },
	breadCrumbs: {
		paddingBottom: 8,
	},
}));
