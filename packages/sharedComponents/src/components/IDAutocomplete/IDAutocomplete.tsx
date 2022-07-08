import { TextField, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import React from "react";

import { IDCheckbox } from "@sharedComponents/components";
import { useStyles } from "@sharedComponents/components/IDAutocomplete/IDAutocomplete.style";

export interface IAutocompleteOption {
	label: string;
	value: any;
}

type AutocompletePropsExtacted = Omit<
	AutocompleteProps<
		any,
		boolean | undefined,
		boolean | undefined,
		boolean | undefined
	>,
	"renderInput"
>;

interface IAutocompleteProps extends AutocompletePropsExtacted {
	title?: string;
	options: IAutocompleteOption[];
	handleChange: (selectedValues: any) => void;
	multiple?: boolean;
}

export const IDAutocomplete: React.FC<IAutocompleteProps> = ({
	title,
	options,
	handleChange,
	multiple,
	...rest
}: IAutocompleteProps) => {
	const classes = useStyles();

	return (
		<Autocomplete
			options={options}
			multiple={multiple}
			disableCloseOnSelect
			renderOption={(option, { selected }) => (
				<>
					<IDCheckbox
						size="small"
						color="primary"
						className={classes.checkbox}
						checked={selected}
					/>
					{option.label}
				</>
			)}
			getOptionLabel={(option) => option.label}
			ChipProps={{
				deleteIcon: <CloseIcon />,
			}}
			onChange={(_e, value) => {
				handleChange(value);
			}}
			renderInput={(params) => (
				<>
					{title && (
						<Typography
							variant="body1"
							color="textPrimary"
							className={classes.title}
						>
							{title}
						</Typography>
					)}
					<TextField variant="outlined" {...params} />
				</>
			)}
			{...rest}
		/>
	);
};
