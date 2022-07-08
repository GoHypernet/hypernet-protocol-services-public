import { Box } from "@material-ui/core";
import React, { useMemo } from "react";

import { useStyles } from "@sharedComponents/components/IDCard/IDCard.style";
import { IDCardHeader } from "@sharedComponents/components/IDCard/IDCardHeader";

interface IIDCardProps {
	title?: string | React.ReactNode;
	description?: string;
	children?: React.ReactNode;
	className?: string;
	hideDivider?: boolean;
	onClick?: () => void;
}

export const IDCard: React.FC<IIDCardProps> = (props: IIDCardProps) => {
	const { title, description, children, className, hideDivider, onClick } =
		props;
	const classes = useStyles();

	const hasCardHeader = useMemo(
		() => !!title || !!description,
		[title, description],
	);

	return (
		<Box className={`${classes.wrapper} ${className}`} onClick={onClick}>
			{hasCardHeader && (
				<IDCardHeader
					title={title}
					description={description}
					hideDivider={hideDivider}
					hasBottomMargin={!!children}
				/>
			)}
			{!!children && (
				<Box
					className={
						hasCardHeader
							? classes.bodyWithHeader
							: classes.bodyWithoutHeader
					}
				>
					{children}
				</Box>
			)}
		</Box>
	);
};
