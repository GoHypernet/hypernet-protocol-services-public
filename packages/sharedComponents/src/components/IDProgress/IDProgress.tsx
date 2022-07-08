import { LinearProgress } from "@material-ui/core";
import { colors } from "@sharedComponents/theme";
import React from "react";

interface IIDProgressProps {
	value: number;
	color?: string;
	height?: number;
}

export const IDProgress: React.FC<IIDProgressProps> = (
	props: IIDProgressProps,
) => {
	const { value, color = colors.GRAY400, height = 6 } = props;

	return (
		<LinearProgress
			style={{ backgroundColor: color, height }}
			variant="determinate"
			value={value}
		/>
	);
};
