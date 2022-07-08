import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
	small: {
		width: 36,
		height: 36,
	},
	medium: {
		width: 56,
		height: 56,
	},
	large: {
		width: 72,
		height: 72,
	},
	avatar: (props: { width: number; height: number }) => ({
		width: props.width,
		height: props.height,
	}),
}));
