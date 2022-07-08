import { Box, Typography } from "@material-ui/core";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDBasicValueWithTitle/IDBasicValueWithTitle.style";

interface IIDBasicValueWithTitle {
	title: string | React.ReactNode;
	value: string | React.ReactNode;
}

export const IDBasicValueWithTitle: React.FC<IIDBasicValueWithTitle> = (
	props: IIDBasicValueWithTitle,
) => {
	console.log("props", props);
	const { title, value } = props;
	const classes = useStyles();

	return (
		<Box className={classes.wrapper}>
			<Typography variant="body2">{title}</Typography>
			<Typography variant="body1">{value}</Typography>
		</Box>
	);
};
