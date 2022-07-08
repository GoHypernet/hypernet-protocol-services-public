import { Box, IconButton, Typography } from "@material-ui/core";
import { Field as FormikField, FieldAttributes } from "formik";
import React, { useEffect, useRef } from "react";

import { useStyles } from "@sharedComponents/components/IDLargeField/IDLargeField.style";

export interface IIDLargeFieldProps extends FieldAttributes<any> {
	title?: string;
	type?: "input" | "textarea" | "select";
	options?: ISelectOption[];
	rightContent?: React.ReactNode;
	focus?: boolean;
}

export interface ISelectOption {
	label: string;
	value: any;
}

export const IDLargeField: React.FC<IIDLargeFieldProps> = (
	props: IIDLargeFieldProps,
) => {
	const {
		title,
		type = "input",
		required,
		options,
		focus,
		rightContent,
	} = props;
	const classes = useStyles({});
	const titleText = `${title}${required ? " *" : ""}`;
	const isSelect = type === "select";

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

			{!isSelect ? (
				<Box className={classes.fieldWrapper}>
					<FormikField
						innerRef={inputRef}
						className={classes.field}
						{...props}
						component={type}
					/>

					{rightContent && (
						<Box className={classes.rightContent}>
							{rightContent}
						</Box>
					)}
				</Box>
			) : (
				<FormikField
					className={classes.field}
					{...props}
					as="select"
					component={type}
				>
					{options?.length &&
						options.map((option) => (
							<option value={option.value}>{option.label}</option>
						))}
				</FormikField>
			)}
		</Box>
	);
};
