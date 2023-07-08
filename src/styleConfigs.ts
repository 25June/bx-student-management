import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true
  }
}

const theme = createTheme({
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textTransform: 'capitalize',
        },
      },
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#424242',
      fontFamily: 'Be Vietnam Pro, sans-serif',
      marginBottom: '0.5rem',
    },
  },
  palette: {
    neutral: {
      main: '#616161',
      light: '#757575',
      dark: '#424242',
      contrastText: '#fff',
    },
  },
})

export default theme
