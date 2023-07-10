import { createTheme } from '@mui/material'
import { pink, blue, lightGreen, brown, amber } from '@mui/material/colors'

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']
    kt: Palette['primary']
    rl: Palette['primary']
    ts: Palette['primary']
    bd: Palette['primary']
    vd: Palette['primary']
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
    kt?: PaletteOptions['primary']
    rl?: PaletteOptions['primary']
    ts?: PaletteOptions['primary']
    bd?: PaletteOptions['primary']
    vd?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    kt: true
    rl: true
    ts: true
    bd: true
    vd: true
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
    kt: {
      main: pink[300],
      light: pink[100],
      dark: pink[800],
      contrastText: '#fff',
    },
    rl: {
      main: lightGreen[500],
      light: lightGreen[100],
      dark: lightGreen[800],
      contrastText: '#fff',
    },
    ts: {
      main: blue[500],
      light: blue[100],
      dark: blue[800],
      contrastText: '#fff',
    },
    bd: {
      main: amber[500],
      light: amber[100],
      dark: amber[800],
      contrastText: '#fff',
    },
    vd: {
      main: brown[500],
      light: brown[100],
      dark: brown[800],
      contrastText: '#fff',
    },
  },
})

export default theme
