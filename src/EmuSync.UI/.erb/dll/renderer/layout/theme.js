"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const OutlinedInput_1 = require("@mui/material/OutlinedInput");
const colours = {
    primary: {
        main: "#a95dcf"
    },
    warning: {
        main: "#F1A208"
    },
    info: {
        main: "#3fade2"
    },
    success: {
        main: "#06A77D"
    },
    error: {
        main: "#dd384eff"
    }
};
function getThemeDefaults() {
    return {
        colorSchemeSelector: "class",
        colorSchemes: {
            //palette for light mode
            light: {
                palette: {
                    secondary: {
                        main: "rgb(30,30,30)",
                    },
                    text: {
                        primary: "rgb(40,40,40)",
                        secondary: "rgb(100,100,100)"
                    },
                    background: {
                        default: "rgb(250,250,250)"
                    },
                    ...colours
                },
            },
            //palette for dark mode
            dark: {
                palette: {
                    background: {
                        default: "rgb(15,21,24)",
                        paper: "rgb(22,28,31)",
                    },
                    secondary: {
                        main: "rgb(220,220,220)",
                    },
                    text: {
                        primary: "rgb(220,220,220)",
                        secondary: "rgb(190,190,190)"
                    },
                    ...colours
                },
            }
        },
        typography: {
            fontSize: 13
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        border: '1px solid rgba(255,255,255,.1)',
                        borderRadius: "1rem"
                    }
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        //all buttons
                        textTransform: "none",
                        fontSize: ".9rem",
                        borderRadius: 50
                    },
                },
            },
            //text boxes using the outlined variant
            MuiOutlinedInput: {
                styleOverrides: {
                    notchedOutline: {
                        transition: "border-color .25s",
                    },
                    root: ({ ownerState, theme }) => ({
                        borderRadius: 15,
                        [`&:hover .${OutlinedInput_1.outlinedInputClasses.notchedOutline}`]: {
                            borderColor: theme.palette.primary.main,
                        }
                    })
                },
            },
            //for performance: https://mui.com/material-ui/react-text-field/#performance
            MuiInputBase: {
                defaultProps: {
                    disableInjectingGlobalStyles: true,
                },
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        "& .MuiOutlinedInput-notchedOutline": {
                            fontSize: "1rem",
                        }
                    })
                }
            },
            //form labels
            MuiInputLabel: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        color: theme.vars.palette.text.primary,
                        fontSize: "1rem"
                    })
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        color: theme.vars.palette.text.primary,
                    }),
                    asterisk: ({ theme }) => ({
                        color: "rgb(255,0,0)"
                    }),
                },
            },
            MuiFormControlLabel: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        color: theme.vars.palette.text.primary,
                        fontSize: "1rem"
                    })
                },
            },
            //form helper text
            MuiFormHelperText: {
                styleOverrides: {
                    root: {
                        margin: 0,
                        marginTop: 5,
                        "&:empty": {
                            display: "none"
                        }
                    }
                },
            },
            MuiAutocomplete: {
                styleOverrides: {
                    root: {
                        "& .MuiAutocomplete-popper": {
                            zIndex: 999999,
                        }
                    },
                }
            },
            //https://github.com/mui/mui-x/issues/1755
            MuiDataGrid: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        backgroundColor: "unset",
                        borderRadius: 15,
                        "& .disabled-row": {
                            pointerEvents: "none",
                            cursor: "default"
                        },
                        "& .visually-disabled-row": {
                            "& .MuiDataGrid-cell": {
                                cursor: "default!important",
                                color: "rgb(160,160,160, .5)"
                            },
                            "&:hover": {
                                background: "unset"
                            }
                        },
                        "& .MuiDataGrid-selectedRowCount": {
                            opacity: 0
                        },
                        "& .MuiDataGrid-columnHeadersInner .MuiDataGrid-columnHeader:last-of-type .MuiDataGrid-columnSeparator": {
                            display: "none"
                        },
                        "& .MuiDataGrid-toolbarContainer": {
                        // borderBottom: `1px solid ${borderColour}`
                        },
                        '& .MuiDataGrid-root': {
                            fontSize: '.85rem',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            fontSize: '.85rem',
                        },
                        "& .MuiDataGrid-columnHeader--last": {
                            "& .MuiDataGrid-columnSeparator--sideRight": {
                                display: "none"
                            }
                        },
                        "& .MuiDataGrid-cell": {
                            minHeight: 52,
                            fontSize: '.85rem',
                            display: "flex",
                            alignItems: "center",
                            "&.sticky-cell": {
                                backgroundColor: theme.vars.palette.background.paper,
                                backgroundImage: theme.vars.overlays[1],
                                position: "sticky",
                                right: "0px",
                                zIndex: 100,
                                "&::after": {
                                    height: "60%",
                                    width: "1px",
                                    content: "''",
                                    backgroundColor: theme.vars.palette.divider,
                                    position: "absolute",
                                    left: "0px"
                                }
                            },
                        },
                        "& .sub-row": {
                            backgroundColor: "rgb(245,245,245)",
                            "& .sticky-cell": {
                                backgroundColor: "rgb(245,245,245)!important"
                            },
                            "&.sub-row-dark ": {
                                backgroundColor: theme.vars.palette.background.paper,
                                backgroundImage: theme.vars.overlays[0],
                                "& .sticky-cell": {
                                    backgroundColor: `${theme.vars.palette.background.paper}!important`,
                                    backgroundImage: theme.vars.overlays[0],
                                }
                            },
                        },
                        "& .MuiTablePagination-input": {
                            display: "inline-flex"
                        },
                        "& .MuiDataGrid-scrollbar": {
                            "&::-webkit-scrollbar": {
                                width: 10,
                                height: 10
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "inherit"
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: "rgba(130,130,130, 0.5)",
                                borderRadius: 50
                            },
                            "&::-webkit-scrollbar-corner": {
                                background: "inherit"
                            }
                        },
                        "& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader.sticky-cell": {
                            position: "sticky",
                            right: "0px",
                            zIndex: 100
                        },
                    }),
                    row: ({ ownerState, theme }) => ({
                        "&:hover": {
                            background: (0, material_1.alpha)(theme.palette.primary.main, 0.1),
                            //hacky background colour
                            "& .MuiDataGrid-cell.sticky-cell::before": {
                                background: (0, material_1.alpha)(theme.palette.primary.main, 0.1),
                                height: "100%",
                                width: "100%",
                                content: "''",
                                position: "absolute",
                                left: "0px",
                                top: "0px"
                            }
                        },
                        "&.remove-row-highlight": {
                            "& .MuiDataGrid-cell": {
                                cursor: "default!important",
                            },
                            cursor: "default!important",
                            "&:hover": {
                                backgroundColor: "inherit",
                            }
                        },
                    }),
                    cell: {
                        cursor: "pointer",
                        paddingTop: ".6rem",
                        paddingBottom: ".6rem",
                        //remove the outline when a cell is clicked on - don't want the implication that cells can be selected
                        "&:focus": {
                            outline: "none"
                        }
                    }
                }
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        fontSize: ".9rem"
                    }
                }
            }
        }
    };
}
const theme = (0, material_1.extendTheme)(getThemeDefaults());
exports.default = theme;
//# sourceMappingURL=theme.js.map