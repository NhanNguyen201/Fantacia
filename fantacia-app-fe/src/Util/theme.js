export default {
    palette: {
        primary: {
            light: '#E3BACE',
            main: "#1fb4c4", // blue
            // main: '#DF9BBD', // pink
            // main: '#000000', // black
            dark: '#ff188b',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ff6333',
            main: '#ff3d00', // red
            dark: '#b22a00',
            contrastText: '#fff'
        },
        contrastColor: {
            main: "#ffffff"
        }
    },
    typography: {
        useNextVariants: true
    },
    form: {
        textAlign: 'center'
    },
    image: {
        height: 100,
        width: 100,
        margin: '20px auto',
    },
    textField: {
        marginBottom: 20
    },
    textFieldEditForm: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        padding: "5px 15px"
    },
    pageTitle: {
        letterSpacing: 15
    },
    button: {
        position: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 20
    }
}