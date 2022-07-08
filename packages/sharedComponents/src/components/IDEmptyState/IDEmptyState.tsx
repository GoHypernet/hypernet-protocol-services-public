import { Box } from "@material-ui/core";
import { HYPERNET_LOGO_DARK } from "@sharedComponents/constants";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDEmptyState/IDEmptyState.style";

interface IIDEmptyStateProps {
	label?: string;
	info?: React.ReactNode;
}

export const IDEmptyState: React.FC<IIDEmptyStateProps> = (
	props: IIDEmptyStateProps,
) => {
	const { label = "No results!", info } = props;
	const classes = useStyles();
	return (
		<Box className={classes.container}>
			<img width="150" src={HYPERNET_LOGO_DARK} />
			<Box className={classes.rightWrapper}>
				<Box className={classes.textWrapper}>
					<Box className={classes.label}>{label}</Box>
					{info && <Box className={classes.info}>{info}</Box>}
				</Box>
			</Box>
		</Box>
	);
};
