const {TextField,Button,Alert,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper,Table,
    TableHead,ThemeProvider,createTheme,Radio,Divider,
    TableRow,Tabs, Tab,Box,Chip,Typography, FormLabel,Rating,DialogTitle,DialogActions,DialogContent,DialogContentText,
    TableCell,TablePagination,Drawer,Link,MenuItem,Dialog,Input,
    TableBody,Fab, Card,CardHeader,Avatar,IconButton,
    InputBase,CardContent
} = MaterialUI;
const {useState,useEffect,useContext,createContext} = React;

const Context = createContext({});

const { red } = MaterialUI.colors;

var format = new Intl.NumberFormat();

let theme = createTheme({
    palette: {
        primary: {
            main: '#0052cc',
        },
        secondary: {
            main: '#edf2ff',
        },
    },
    components:{
        MuiButton:{
            styleOverrides:{
                root:{
                    borderRadius:"64px",
                    textTransform:"none",
                    padding:"6px 24px"
                }
            },
            defaultProps: {
                variant: 'contained', // Set the default variant to 'contained'
            },
        },
        MuiTab:{
            styleOverrides:{
                root:{
                    textTransform:"none",
                    minHeight:"unset"
                }
            }
        },
        MuiDialog:{
            styleOverrides:{
                root:{
                    borderRadius:"24px",
                    textTransform:"none"
                },
                paper:{
                    borderRadius:"16px"
                }
            }
        },
    }
});

const styles = {
    fab:{
        boxShadow:"none",
        background:"inherit"
    },
    btn:{
        textTransform:"none",
        lineHeight:"unset"
    },
    smallBtn:{
        textTransform:"none",
        lineHeight:"unset",
        padding:"5px 14px"
    }
}

const useStorage = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) != null ? JSON.parse(localStorage.getItem(key)) : initialState
    );

    React.useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
};

window.onload = function(){
    ReactDOM.render(<ThemeProvider theme={theme}><Index /></ThemeProvider>, document.getElementById("root"));
}

function Index(){
    const [settings,setSettings] = useState({
        logo:"clogo.png",
        name:"School",
        reg_fee:500
    })
    
    const getData = () => {
        $.get("api/", {getSettings2:"true"}, res=>{
            setSettings({...settings, ...res});
        })
    }

    const makePayment = () => {
        let random = Math.floor((Math.random() * 1000000000) + 1);
        $.post("api/", {saveRef:random,type:"paychangu"}, res=>{
            PaychanguCheckout({
                "public_key": "pub-live-AkdzhBXueOLvshxcT4icXi8xg9L1WhMB",
                "tx_ref": '' + random,
                "amount": settings.reg_fee,
                "currency": "MWK",
                //"callback_url": "https://malawi-schools.com/payefo/success-changu.php",
                "callback_url": "https://localhost/payefo/success-changu.php",
                "return_url": "https://example.com/returnurl",
                "customer":{
                    "email": "yourmail@example.com",
                    "first_name":"Mac",
                    "last_name":"Phiri",
                },
                "customization": {
                    "title": "Registration Payment",
                    "description": "First payment to register",
                },
                "meta": {
                    "uuid": "uuid",
                    "response": "Response"
                }
            });
        });
    }

    useEffect(()=>{
        getData();
    }, []);

    return (
        <Context.Provider value={{}}>
            <div className="w3-row">
                <div className="w3-col m4">&nbsp;</div>
                <div className="w3-col m4">
                    <Paper sx={{borderRadius:"24px",mt:4}}>
                        <div className="w3-center pt-3 pb-3">
                            <img src={"../uploads/"+settings.logo} height="40" />
                        </div>
                        <div className="w3-center pt-3 pb-3">
                            <Typography variant="h4">Complete Registration</Typography>
                        </div>
                        <div className="p-3">
                            To complete registration, you are required to pay a non refundable fee of MWK{settings.reg_fee}
                        </div>
                        <div className="py-4 w3-center">
                            <Button variant="contained" onClick={makePayment}>Use Paychangu</Button>
                        </div>
                    </Paper>
                </div>
            </div>
        </Context.Provider>
    )
}