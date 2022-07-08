import { Box, Typography } from "@material-ui/core";
import React from "react";

import { useStyles } from "@sharedComponents/components/ListItemValueWithTitle/ListItemValueWithTitle.style";

export interface IListItemValueWithTitle {
	title: string;
	value: string | number | React.ReactNode;
}

export const ListItemValueWithTitle: React.FC<IListItemValueWithTitle> = (
	props: IListItemValueWithTitle,
) => {
	const { title, value } = props;
	const classes = useStyles({});

	return (
		<Box className={classes.wrapper}>
			<Typography
				variant="body2"
				color="textPrimary"
				className={classes.title}
			>
				{title}
			</Typography>

			<Typography
				variant="body1"
				color="textPrimary"
				className={classes.value}
			>
				{value}
			</Typography>
		</Box>
	);
};
