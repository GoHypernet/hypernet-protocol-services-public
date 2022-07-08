import { Box, Typography } from "@material-ui/core";
import { colors } from "@sharedComponents/theme";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDTag/IDTag.style";

export enum ETagColor {
	BLUE,
	PURPLE,
	GREEN,
	GRAY,
	RED,
}

export interface ITagConfig {
	backgroundColor: string;
	borderColor: string;
	textColor: string;
}

interface IIDTagProps {
	text: string;
	color: ETagColor;
}

export const IDTag: React.FC<IIDTagProps> = (props: IIDTagProps) => {
	const { text, color } = props;
	const config = getTagConfig(color);
	const classes = useStyles({ config });

	return (
		<Box className={classes.wrapper}>
			<Typography className={classes.text} variant="body1">
				{text}
			</Typography>
		</Box>
	);
};

const getTagConfig = (color: ETagColor): ITagConfig => {
	switch (color) {
		case ETagColor.BLUE:
			return {
				backgroundColor: colors.BLUE100,
				borderColor: colors.BLUE200,
				textColor: colors.BLUE400,
			};
		case ETagColor.GREEN:
			return {
				backgroundColor: colors.GREEN100,
				borderColor: colors.GREEN200,
				textColor: colors.GREEN400,
			};
		case ETagColor.RED:
			return {
				backgroundColor: colors.RED100,
				borderColor: colors.RED200,
				textColor: colors.RED400,
			};
		case ETagColor.GRAY:
			return {
				backgroundColor: colors.GRAY100,
				borderColor: colors.GRAY200,
				textColor: colors.GRAY400,
			};
		default:
			return {
				backgroundColor: colors.BLUE100,
				borderColor: colors.BLUE200,
				textColor: colors.BLUE400,
			};
	}
};
