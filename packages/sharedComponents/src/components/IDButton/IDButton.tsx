import {
	Button as MuiButton,
	PropTypes,
	CircularProgress,
	Box,
	ButtonProps,
} from "@material-ui/core";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDButton/IDButton.style";

export interface IIDButton extends ButtonProps {
	color?: PropTypes.Color;
	onClick: () => void;
	disabled?: boolean;
	loading?: boolean;
	variant?: "text" | "outlined" | "contained";
	children?: string | React.ReactNode;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	autoFocus?: boolean;
	size?: "small" | "medium" | "large";
	isDangerButton?: boolean;
	fullWidth?: boolean;
}

export const IDButton: React.FC<IIDButton> = ({
	color,
	onClick,
	disabled,
	loading,
	variant,
	children,
	startIcon,
	endIcon,
	autoFocus,
	size,
	isDangerButton,
	fullWidth,
	...rest
}: IIDButton) => {
	const classes = useStyles();

	return (
		<MuiButton
			{...rest}
			disableElevation
			onClick={onClick}
			variant={variant}
			color={color}
			disabled={disabled}
			startIcon={startIcon}
			endIcon={endIcon}
			autoFocus={autoFocus}
			size={size}
			fullWidth={fullWidth}
		>
			{children}
			{loading && (
				<Box className={classes.loadingWrapper}>
					<CircularProgress color="inherit" size={13} />
				</Box>
			)}
		</MuiButton>
	);
};
