import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#f5c518', // IMDb Yellow
            contrastText: '#000000', // Black text for legibility
        },
        secondary: {
            main: '#ffffff',
        },
        background: {
            default: '#141414', // Netflix Dark Background
            paper: '#141414',
        },
        text: {
            primary: '#fff',
            secondary: '#b3b3b3',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 500 },
        h6: { fontWeight: 500 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#121212', // IMDb Dark Navbar
                    boxShadow: 'none',
                    borderBottom: '1px solid #333',
                },
            },
        },
    },
});

export default theme;
