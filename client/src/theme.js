import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#f5c518', // Cinematic Gold / Amber
            light: '#ffe066',
            dark: '#c49b04',
            contrastText: '#000000',
        },
        secondary: {
            main: '#e50914', // Crimson Red
            light: '#ff334b',
            dark: '#b20710',
            contrastText: '#ffffff',
        },
        background: {
            default: '#0c0d12', // Ultra Deep Cinematic Dark
            paper: '#141620',   // Deep Card Dark
            elevated: '#1c1f2e',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.65)',
            disabled: 'rgba(255, 255, 255, 0.38)',
        },
        divider: 'rgba(255, 255, 255, 0.08)',
    },
    typography: {
        fontFamily: [
            '"Plus Jakarta Sans"',
            '"Outfit"',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            'sans-serif',
        ].join(','),
        h1: {
            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h3: {
            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h4: {
            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h5: {
            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
            fontWeight: 600,
        },
        h6: {
            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
            fontWeight: 600,
        },
        button: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 600,
            textTransform: 'none',
        }
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s ease-in-out',
                },
                containedPrimary: {
                    backgroundColor: '#f5c518',
                    color: '#000000',
                    '&:hover': {
                        backgroundColor: '#ffd700',
                        boxShadow: '0 0 20px rgba(245, 197, 24, 0.4)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#141620',
                    backgroundImage: 'none',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(12, 13, 18, 0.85)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 6,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(245, 197, 24, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f5c518',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
