import {
	Box,
	Typography,
	TableContainer,
	Table as MuiTable,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableCellProps,
	useMediaQuery,
	IconButton,
	Collapse,
	useTheme,
} from "@material-ui/core";
import {
	ExpandMore as ExpandMoreIcon,
	ExpandLess as ExpandLessIcon,
} from "@material-ui/icons";
import React, { useState } from "react";

import {
	IDButton,
	IDBasicValueWithTitle,
	IDCard,
} from "@sharedComponents/components";
import { IIDButton } from "@sharedComponents/components/IDButton";
import { useStyles } from "@sharedComponents/components/IDTable/IDTable.style";

interface IHeaderAction extends IIDButton {
	label: string;
}

export interface ITableCell {
	tableCellProps?: TableCellProps;
	mobileCellValue?: string | React.ReactNode;
	cellValue?: string | React.ReactNode;
	onlyVisibleInExpandedState?: boolean;
}

interface IDTableProps {
	title?: string;
	description?: string;
	headerAction?: IHeaderAction;
	columns: ITableCell[];
	rows: ITableCell[][];
	isExpandable?: boolean;
}

export const IDTable: React.FC<IDTableProps> = (props: IDTableProps) => {
	const { title, description, headerAction, columns, rows, isExpandable } =
		props;

	const theme = useTheme();
	const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"), {
		noSsr: true,
	});
	const classes = useStyles();
	const [expandedRowIndex, setExpandedRowIndex] = useState<number>();

	const handleExpandClick = (rowIndex: number) => {
		if (rowIndex === expandedRowIndex) {
			setExpandedRowIndex(-1);
		} else {
			setExpandedRowIndex(rowIndex);
		}
	};

	return (
		<Box>
			{title && (
				<Box className={classes.topWrapper}>
					<Box className={classes.titleWrapper}>
						<Typography variant="h6">{title}</Typography>
						{headerAction && (
							<IDButton
								{...headerAction}
								size="medium"
								color="primary"
							>
								{headerAction.label}
							</IDButton>
						)}
					</Box>
					{description && (
						<Box className={classes.description}>
							<Typography variant="body1">
								{description}
							</Typography>
						</Box>
					)}
				</Box>
			)}

			{isLargeScreen ? (
				<TableContainer>
					<MuiTable aria-label="simple table">
						<TableHead>
							<TableRow>
								{isExpandable && (
									<TableCell
										width="16"
										className={classes.tableColumnHeader}
									></TableCell>
								)}
								{columns
									.filter(
										(column) =>
											!column.onlyVisibleInExpandedState,
									)
									.map((column, index) => (
										<TableCell
											key={index}
											{...column.tableCellProps}
											className={
												classes.tableColumnHeader
											}
										>
											{column.cellValue}
										</TableCell>
									))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((rowItems, index) => {
								const isExpanded = index === expandedRowIndex;
								return (
									<>
										<TableRow key={index}>
											{isExpandable && (
												<TableCell
													width="16"
													className={
														classes.tableCell
													}
												>
													<IconButton
														aria-label="expand"
														onClick={() => {
															handleExpandClick(
																index,
															);
														}}
													>
														{isExpanded ? (
															<ExpandLessIcon />
														) : (
															<ExpandMoreIcon />
														)}
													</IconButton>
												</TableCell>
											)}
											{rowItems
												.filter(
													(rowItem) =>
														!rowItem.onlyVisibleInExpandedState,
												)
												.map((rowItem) => (
													<TableCell
														{...rowItem.tableCellProps}
														className={
															classes.tableCell
														}
													>
														{rowItem.cellValue}
													</TableCell>
												))}
										</TableRow>
										<TableRow>
											<TableCell
												style={{
													paddingBottom: isExpanded
														? 24
														: 0,
													paddingTop: isExpanded
														? 24
														: 0,
													paddingLeft: isExpanded
														? 96
														: 0,
													paddingRight: isExpanded
														? 96
														: 0,
												}}
												colSpan={6}
											>
												<Collapse
													in={isExpanded}
													timeout="auto"
													unmountOnExit
												>
													{rowItems
														.filter(
															(rowItem) =>
																rowItem.onlyVisibleInExpandedState,
														)
														.map(
															(
																rowItem,
																index,
															) => {
																const filteredColumns =
																	columns.filter(
																		(
																			rowItem,
																		) =>
																			rowItem.onlyVisibleInExpandedState,
																	);
																return (
																	<IDBasicValueWithTitle
																		title={
																			filteredColumns[
																				index
																			]
																				?.mobileCellValue ||
																			filteredColumns[
																				index
																			]
																				?.cellValue
																		}
																		value={
																			rowItem.mobileCellValue ||
																			rowItem.cellValue
																		}
																	/>
																);
															},
														)}
												</Collapse>
											</TableCell>
										</TableRow>
									</>
								);
							})}
						</TableBody>
					</MuiTable>
				</TableContainer>
			) : (
				rows.map((rowItems, index) => {
					const isExpanded = index === expandedRowIndex;

					return (
						<IDCard key={index} className={classes.mobileRowCard}>
							{rowItems
								.filter(
									(column) =>
										!column.onlyVisibleInExpandedState,
								)
								.map((rowItem, index) => {
									const filteredColumns = columns.filter(
										(rowItem) =>
											!rowItem.onlyVisibleInExpandedState,
									);
									return (
										<IDBasicValueWithTitle
											title={
												filteredColumns[index]
													?.mobileCellValue ||
												filteredColumns[index]
													?.cellValue
											}
											value={
												rowItem.mobileCellValue ||
												rowItem.cellValue
											}
										/>
									);
								})}

							<Collapse
								in={isExpanded}
								timeout="auto"
								unmountOnExit
							>
								{rowItems
									.filter(
										(column) =>
											column.onlyVisibleInExpandedState,
									)
									.map((rowItem, index) => {
										const filteredColumns = columns.filter(
											(rowItem) =>
												rowItem.onlyVisibleInExpandedState,
										);
										return (
											<IDBasicValueWithTitle
												title={
													filteredColumns[index]
														?.mobileCellValue ||
													filteredColumns[index]
														?.cellValue
												}
												value={
													rowItem.mobileCellValue ||
													rowItem.cellValue
												}
											/>
										);
									})}
							</Collapse>

							{isExpandable && (
								<IDButton
									className={classes.mobileExpandButton}
									fullWidth
									size="small"
									onClick={() => {
										handleExpandClick(index);
									}}
								>
									{isExpanded ? (
										<ExpandLessIcon />
									) : (
										<ExpandMoreIcon />
									)}
								</IDButton>
							)}
						</IDCard>
					);
				})
			)}
		</Box>
	);
};
