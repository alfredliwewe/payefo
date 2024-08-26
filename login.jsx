const {TextField, Button, Fab, Link, Typography, InputAdornment, Alert, Tabs, Tab} = MaterialUI;
const {Box, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIcon, createTheme, ThemeProvider} = MaterialUI;
const {Dialog, DialogActions,DialogContent, DialogContentText, MenuItem, DialogTitle} = MaterialUI;
let {alpha, TableBody, TableCell, TableContainer, RadioGroup, Radio, FormLabel,Rating,
	TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Paper, Checkbox, IconButton, Tooltip,
    Chip, Avatar, FilledInput, FormControl, InputLabel,
	FormControlLabel,Switch, DeleteIcon, FilterListIcon, visuallyHidden
} = MaterialUI;

const {useState, useEffect, createContext, useContext, useLayoutEffect } = React;

const SigninContext = createContext({})
var School = createContext({});
var user;

let theme = createTheme({
	palette: {
		primary: {
			main: '#023e8a',
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
            defaultProps:{
                variant:"outlined"
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
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '8px',
                    },
                },
            },
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

$(document).ready(function(){
    //ReactDOM.render(<Activity />, _('root'));

    try{
        ReactDOM.render(<Login />, _('root'));
    }
    catch(E){
        alert(E.toString())
    }
});

function Login(){
    const [errors,setErrors] = useState({
        email:false,
        emailError:"",
        password:false,
        passwordError:"",
		emailForgot:false,
		emailForgotError:""
    });
    const [settings,setSettings] = useState({
        logo:"clogo.png",
        name:"School"
    })
	const [showPassword, setShowPassword] = React.useState(false);
	const [stage, setStage] = useState("login");
	const [done, setDone] = useState({
		error:false,
		msg:"Forgot password? Enter your email and we will send you a reset password link"
	});
    const [width,setWidth] = useState(400);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

    const handleSubmit = (event) => {
        event.preventDefault();

        let form = event.target;

        $.post("api/", $(form).serialize(), function(response){
			try{
				let res = JSON.parse(response);
				if(res.status){
					window.localStorage.setItem("user", response);
					window.location = res.link;
				}
				else{
					//alert(res.type);
					if(res.type == "email"){
						setErrors({...errors, email:true,emailError:res.message,password:false});
					}
					else{
						setErrors({...errors, password:true,passwordError:res.message,email:false,emailError:""});
					}
				}
			}
			catch(E){
				alert(E.toString()+response);
			}
        })
    }

	const handleForgot = (event) => {
        event.preventDefault();

        let form = event.target;

        $.post("api/", $(form).serialize(), function(response){
			try{
				let res = JSON.parse(response);
				if(res.status){
					setDone({...done, msg:"Your reset password email was sent. Check your inbox"});
				}
				else{
					setErrors({...errors, emailForgot:true,emailForgotError:res.message});
					setDone({error:true, msg:res.message})
				}
			}
			catch(E){
				alert(E.toString()+response);
			}
        })
    }

    const getData = () => {
        $.get("api/", {getSettings:"true"}, res=>{
            setSettings({...settings, ...res});
        })
    }

    useEffect(()=>{
        getData();

        if(innerHeight > innerWidth){
            setWidth(innerWidth*.89)
        }
    }, []);

    return (<>
		<ThemeProvider theme={theme}>
			<div className="bcenter" style={{background:"#d3d3d4", height:window.innerHeight+"px", width:"100%"}}>
                <div className="w3-padding-large w3-round-xxlarge w3-white shadow" style={{width:width+"px"}}>
                    <div className="pt-15 pb-15 w3-center">
                        <img src={"uploads/"+settings.logo} height="80" onClick={event=>{
                            window.location = "index.php";
                        }} style={{cursor:"pointer"}} />
                        <font className="bold block mt-15" style={{fontSize:"1.2rem"}}>{settings.name}</font>
                    </div>
                    {stage == "login"?
                    <form onSubmit={handleSubmit} className="pb-20">
                        <TextField
                            id="filled-password-input"
                            label="Email or phone"
                            name="email_login"
                            error={errors.email}
                            helperText={errors.emailError}
                            fullWidth/>
                        
                        <TextField 
                            sx={{ mt: 2}} 
                            fullWidth 
                            error={errors.password} 
                            helperText={errors.password?errors.passwordError:"Password"}
                            label="Password"
                            name="password"
                            type="password"
                            />
                            

                        <Typography sx={{mb:3,mt:3,display:"none"}}>
                            Not yet a memer? <Link href="register.php" style={{fontWeight:"bold"}}>Click here</Link> to register
                        </Typography>

                        <div className="clearfix pt-30">
                            <Button type="submit" role="submit" size="large" fullWidth variant="contained">Login</Button>
                        </div>
                        <Typography sx={{pb:3,mt:3}} onClick={e=>{
                                setStage("forgot")
                            }}>
                            <Link href="#" style={{fontWeight:"bold"}}>Forgot password??</Link>
                        </Typography>
                        <div className="clearfix pt-30">
                            <Button size="large" fullWidth variant="outlined" onClick={e=>setStage("register")}>New User? Register</Button>
                        </div>
                    </form>:
                    stage == "register"?
                    <form onSubmit={handleSubmit} className="pb-20">
                        <TextField
                            id="filled-password-input"
                            sx={{ mt: 2}} 
                            label="Fullname "
                            name="fullname"
                            error={errors.email}
                            helperText={errors.emailError}
                            size="small"
                            fullWidth/>

                        <TextField
                            id="filled-password-input"
                            label="Phone"
                            sx={{ mt: 2}} 
                            name="phone"
                            error={errors.email}
                            helperText={errors.emailError}
                            size="small"
                            fullWidth/>

                        <TextField
                            sx={{ mt: 2}} 
                            id="filled-password-input"
                            label="Email"
                            name="email_register"
                            error={errors.email}
                            helperText={errors.emailError}
                            size="small"
                            fullWidth/>
                        
                        <TextField 
                            sx={{ mt: 2}} 
                            fullWidth 
                            error={errors.password} 
                            helperText={errors.password?errors.passwordError:"Password longer or equal to 6 character"}
                            label="Password"
                            name="password"
                            size="small"
                            type="password"
                            />

                        <div className="clearfix pt-30">
                            <Button type="submit" role="submit" size="large" fullWidth variant="contained">Register</Button>
                        </div>
                        
                        <div className="clearfix pt-30">
                            <Button size="large" fullWidth variant="outlined" onClick={e=>setStage("login")}>Already User? Login</Button>
                        </div>
                    </form>:
                    <form onSubmit={handleForgot} className="pb-20">
                        <Typography sx={{pb:1}} style={{color:(done.error?"var(--bs-red)":"var(--bs-secondary)")}}>{done.msg}</Typography>
                        <TextField
                            id="filled-password-input"
                            label="Email or phone"
                            name="email_forgot"
                            error={errors.emailForgot}
                            variant="filled"
                            helperText={errors.emailForgotError}
                            fullWidth/>
                        
                
                        <div className="clearfix pt-30">
                            <Button type="submit" role="submit" size="large" fullWidth variant="contained">Send Link</Button>
                        </div>
                        <Typography sx={{pb:3,mt:3}}>
                            <Link href="#" onClick={e=>{
                                setStage("login")
                            }} style={{fontWeight:"bold"}}>Go to login</Link>
                        </Typography>
                    </form>}
                </div>
			</div>
		</ThemeProvider>
    </>)
}