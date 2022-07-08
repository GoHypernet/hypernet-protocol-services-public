import { Box, TextField, TextFieldProps, Typography } from "@material-ui/core";
import React, { useEffect, useRef } from "react";

import { useStyles } from "@sharedComponents/components/IDTextField/IDTextField.style";
type TextFieldPropsExtacted = Omit<TextFieldProps, "any">;

export interface IIDTextFieldProps extends TextFieldPropsExtacted {
	title?: string;
	required?: boolean;
	focus?: boolean;
	inputClassName?: string;
}

export const IDTextField: React.FC<IIDTextFieldProps> = (
	props: IIDTextFieldProps,
) => {
	const { title, required, focus, inputClassName, ...muiTextFieldProps } =
		props;
	const classes = useStyles({});
	const titleText = `${title}${required ? " *" : ""}`;

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (focus) {
			inputRef.current?.focus();
		}
	}, []);

	return (
		<Box className={classes.wrapper}>
			{title && (
				<Typography
					variant="body1"
					color="textPrimary"
					className={classes.title}
				>
					{titleText}
				</Typography>
			)}

			<Box className={classes.fieldWrapper}>
				<TextField
					classes={{ root: inputClassName }}
					innerRef={inputRef}
					{...muiTextFieldProps}
				/>
			</Box>
		</Box>
	);
};
