import { Checkbox, CheckboxProps } from "@material-ui/core";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDCheckbox/IDCheckbox.style";

interface IDCheckboxProps extends CheckboxProps {}

export const IDCheckbox: React.FC<IDCheckboxProps> = (
	props: IDCheckboxProps,
) => {
	const classes = useStyles();
	return (
		<Checkbox
			{...props}
			disableRipple
			className={`${classes.root} ${props?.className}`}
			icon={<span className={classes.icon} />}
			checkedIcon={
				<span className={`${classes.icon} ${classes.checkedIcon}`} />
			}
		/>
	);
};
