import { createTheme } from '@mui/material'
import { pink, blue, lightGreen, brown, amber, red } from '@mui/material/colors'

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']
    kt: Palette['primary']
    rl: Palette['primary']
    ts: Palette['primary']
    bd: Palette['primary']
    vd: Palette['primary']
    dt: Palette['primary']
    score5: Palette['primary']
    score15: Palette['primary']
    score45: Palette['primary']
    score60: Palette['primary']
    absentWarning1: Palette['primary']
    absentWarning2: Palette['primary']
    absentWarning3: Palette['primary']
    presentInform1: Palette['primary']
    presentInform2: Palette['primary']
    presentInform3: Palette['primary']
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
    kt?: PaletteOptions['primary']
    rl?: PaletteOptions['primary']
    ts?: PaletteOptions['primary']
    bd?: PaletteOptions['primary']
    vd?: PaletteOptions['primary']
    dt?: PaletteOptions['primary']
    score5?: PaletteOptions['primary']
    score15?: PaletteOptions['primary']
    score45?: PaletteOptions['primary']
    score60?: PaletteOptions['primary']
    absentWarning1: Palette['primary']
    absentWarning2: Palette['primary']
    absentWarning3: Palette['primary']
    presentInform1: Palette['primary']
    presentInform2: Palette['primary']
    presentInform3: Palette['primary']
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
    dt: true
    absentWarning1: true
    absentWarning2: true
    absentWarning3: true
    presentInform1: true
    presentInform2: true
    presentInform3: true
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
    fontFamily: 'Be Vietnam Pro, Roboto',
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
    dt: {
      main: red[500],
      light: red[100],
      dark: red[800],
      contrastText: '#fff',
    },
    score5: {
      main: '#89C0B7',
      light: brown[100],
      dark: brown[800],
      contrastText: '#fff',
    },
    score15: {
      main: '#B7E1E4',
      light: brown[100],
      dark: brown[800],
      contrastText: '#fff',
    },
    score45: {
      main: '#6F91B5',
      light: brown[100],
      dark: brown[800],
      contrastText: '#fff',
    },
    score60: {
      main: '#EF8F88',
      light: brown[100],
      dark: brown[800],
      contrastText: '#fff',
    },
    absentWarning1: {
      main: red[300],
      light: red[300],
      dark: red[300],
      contrastText: '#fff',
    },
    absentWarning2: {
      main: red[400],
      light: red[400],
      dark: red[400],
      contrastText: '#fff',
    },
    absentWarning3: {
      main: red[500],
      light: red[500],
      dark: red[500],
      contrastText: '#fff',
    },
    presentInform1: {
      main: amber[700],
      light: amber[700],
      dark: amber[700],
      contrastText: '#fff',
    },
    presentInform2: {
      main: amber[800],
      light: amber[800],
      dark: amber[800],
      contrastText: '#fff',
    },
    presentInform3: {
      main: amber[900],
      light: amber[900],
      dark: amber[900],
      contrastText: '#fff',
    },
  },
})

export default theme
