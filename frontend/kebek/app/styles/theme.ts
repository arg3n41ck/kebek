import { createTheme, ThemeOptions } from '@mui/material/styles';
// import { green, orange } from '@mui/material/colors';

const primary = '#219653';
const secondary = '#FECB25';

const defaultTheme = createTheme({});

export const theme = createTheme(defaultTheme, {
  palette: {
    primary: {
      main: primary,
      light: '#5bc880',
      dark: '#006729',
      contrastText: 'white',
    },

    secondary: {
      main: secondary,
    },
    
    info: {
      main: '#BDBDBD',
      light: '#BDBDBD',
      dark: '#BDBDBD',
      contrastText: 'black',
    }
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '3px',
          fontSize: '18px',
          fontWeight: '500',
          textTransform: 'none',
          padding: '13px 30px',
          boxShadow: '0',
          cursor: 'pointer',
        },
        outlined: {
          // color: primary,
        }
      }
    },

    MuiSlider: {
      styleOverrides: {
        root: {
          '.MuiSlider-valueLabel': {
            color: "#092F33",
            backgroundColor: "white",
            border: "1px solid #E0E0E0"
          },
          '.MuiSlider-thumb': {
            color: "white",
            border: "2px solid #219653",
            background: "white",
          },
          '.MuiSlider-thumb-hover': {
            boxShadow: "0 0 0 3px #D6EFE6"
          },
        }
      }
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#219653',

        },
      }
    },

    MuiPaginationItem: {
      styleOverrides: {
        root: {
          [defaultTheme.breakpoints.down('sm')]: {
            // backgroundColor: 'red'
          }
        },
        previousNext: {
          color: primary,
        },
        page: {
          color: '#BDBDBD'
        },
      }
    },

    MuiFormControl: {
      styleOverrides: {
        root: {
          '.MuiSelect-select': {
            border: "none",
            boxShadow: "none"
          },
          '.MuiSelect-nativeInput': {
            border: "none",
            boxShadow: "none"
          }
        }
      }
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          '&:before, &:after': {
            display: 'none',
          },
          fontFamily:"Rubik",
          fontWeight: "300",
          fontSize: "18px",
          color: "#092F33",
        }
      }
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          ".MuiAccordionSummary-expandIconWrapper": {
            transform: 'rotate(0deg)',
          },
          ".MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: 'rotate(90deg)',
          }
        }
      }
    },

    MuiDrawer: {
      styleOverrides: {
        root: {
          '.MuiDrawer-paperAnchorBottom': {
            borderRadius: "20px 20px 0 0",
          }
        }
      }
    },

    MuiAutocomplete:{
      styleOverrides: {
        root:{
          '.MuiAutocomplete-groupLabel':{
            fontFamily: 'Rubik',
     }}}},

    MuiTypography:{
      styleOverrides:{
        root: {
          fontFamily: 'Rubik',
        }
      }
    },

    MuiInputLabel:{
      styleOverrides: {
        root: {
          fontFamily: 'Rubik',
          fontWeight: "300",
          fontSize: "18px",
          color: "#092F33",
        }
      }
    },

    MuiOutlinedInput:{
      styleOverrides: {
        root: {
          padding:"14px 39px 14px 20px !important",
          '.MuiInputBase-input':{
            padding:"0 !important",
          }
        }
      }
    },
    
    MuiAvatar: {
      styleOverrides:{
        root:{
          width: 28,
          height: 28
        }
      }
    },

    MuiBadge:{
      styleOverrides:{
        root:{
          width: 18,
          height: 18
        }
      }
    },
    MuiInput:{
      styleOverrides: {
        root:{
          '&:focus':{
            backgroundColor:"none"
          }
        }
      }
    }
}
} as ThemeOptions);
