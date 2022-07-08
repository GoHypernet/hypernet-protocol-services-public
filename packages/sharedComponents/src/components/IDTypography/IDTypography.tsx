import { Typography, TypographyProps } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDTypography/IDTypography.style";

interface ITypography extends TypographyProps {
	customVariant?: "label" | "link" | "subtitle2";
	className?: string;
}

export const IDTypography: React.FC<ITypography> = ({
	children,
	customVariant,
	className,
	...rest
}: ITypography) => {
	const classes = useStyles();

	return (
		<Typography
			{...rest}
			className={`${className} ${clsx({
				[classes[customVariant || ""]]: true,
			})}`}
		>
			{children}
		</Typography>
	);
};
