import { Chip, ChipProps } from "@material-ui/core";
import { colors } from "@sharedComponents/theme";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDChip/IDChip.style";

type ChipPropsExtacted = Omit<ChipProps, "color">;

export type ChipColorTypes = "blue" | "gray" | "green" | "orange";

export interface IDChipProps extends ChipPropsExtacted {
	color?: ChipColorTypes;
}

export const IDChip: React.FC<IDChipProps> = (props: IDChipProps) => {
	const { label, color = "gray", className, ...rest } = props;
	const colorCodes = getChipColorCodes(color);
	const classes = useStyles(colorCodes);

	return (
		<Chip
			className={`${classes.chip} ${className}`}
			label={label}
			{...rest}
		/>
	);
};

const getChipColorCodes = (type: ChipColorTypes) => {
	switch (type) {
		case "blue":
			return {
				backgroundColor: colors.BLUE100,
				color: colors.BLUE400,
			};
		case "green":
			return {
				backgroundColor: colors.GREEN100,
				color: colors.GREEN400,
			};
		case "orange":
			return {
				backgroundColor: colors.ORANGE100,
				color: colors.ORANGE400,
			};
		case "gray":
			return {
				backgroundColor: colors.GRAY200,
				color: colors.GRAY400,
			};
	}
};
