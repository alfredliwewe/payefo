const {TextField,Button,Alert,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper,Table,
    TableHead,ThemeProvider,createTheme,Radio,Divider,
    TableRow,Tabs, Tab,Box,Chip,Typography, FormLabel,Rating,DialogTitle,DialogActions,DialogContent,DialogContentText,
    TableCell,TablePagination,Drawer,Link,MenuItem,Dialog,Input,
    TableBody,Fab, Card,CardHeader,Avatar,IconButton,
    InputBase,CardContent,FormControlLabel,Checkbox
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
    const [page,setPage]= useState("Home"); //Home
    const [hasSubscribed,setHasSubscribed] = useState(false);
    const [activeBook,setActiveBook] = useState({})
    const [settings,setSettings] = useState({
        logo:"clogo.png",
        name:"School"
    })
    
    const menus = [
        {
            title:"Home",
            icon:"fa fa-home"
        },
        {
            title:"Registration",
            icon:"fa fa-list-ol"
        },
        {
            title:"Resources",
            icon:"fa fa-user-friends"
        },
        {
            title:"Lessons",
            icon:"fa fa-list-ol"
        },
        {
            title:"Tests",
            icon:"fa fa-user-friends text-danger"
        },
        {
            title:"Profile",
            icon:"fa fa-user"
        }
    ]

    const getData = () => {
        $.get("api/", {getSettings2:"true"}, res=>{
            setSettings({...settings, ...res});
        })
    }

    useEffect(()=>{
        getData();
    }, []);

    return (
        <Context.Provider value={{page,setPage,hasSubscribed,setHasSubscribed,activeBook,setActiveBook}}>
            <div className="w3-row">
                <div className="w3-col w3-border-right" style={{height:window.innerHeight+"px",overflow:"auto",width:"200px"}}>
                    <div className="w3-center pt-3 pb-3">
                        <img src={"../uploads/"+settings.logo} height="40" />
                    </div>
                    {menus.map((row,index)=>(
                        <MenuButton data={row} key={row.title} isActive={page == row.title} onClick={()=>setPage(row.title)} />
                    ))}

                    <MenuButton data={{title:"Logout",icon:"fa fa-power-off"}} isActive={false} onClick={()=>{
                        window.location = '../logout.php';
                    }} />
                </div>
                <div className="w3-rest" style={{height:window.innerHeight+"px",overflow:"auto"}}>
                    {page == "Home" ? <Home />:
                    page == "Resources" ? <Resources />:
                    page == "View" ? <View />:
                    page == "Programmes" ? <Programmes />:
                    page == "Staff" ? <Staff />:
                    page == "Languages" ? <Languages />:
                    page == "Packages" ? <MainPackages />:
                    page == "Lessons" ? <AvailableLessons />:
                    page == "Lesson" ? <Lesson />:
                    page == "System Values" ? <Settings />:
                    page == "Profile" ? <Profile />:
                    page == "Registration" ? <Registration />:
                    page == "Tests" ? <Exams />:
                    page == "Exam" ? <Exam />:
                    <>{page}</>}
                </div>
            </div>
        </Context.Provider>
    )
}

function MenuButton(props){
    return (
        <>
            <div className={"p-2 hover:bg-gray-100 pointer menu-button "+(props.isActive?"bg-gray-100 active":"")} onClick={e=>{
                if(props.onClick != undefined){
                    props.onClick(e);
                }
            }}>
                <span className="w3-center" style={{width:"50px",display:"inline-block"}}>
                    <i className={props.data.icon} />
                </span>
                <font>{props.data.title}</font>
            </div>
        </>
    )
}

function Home(){
    const [data,setData] = useState({
        
    });
    const {page,setPage,hasSubscribed,setHasSubscribed} = useContext(Context);
    const [subscriptions,setSubscriptions] = useState([]);

    const [packages,setPackages] = useState([]);
    const [active,setActive] = useState({});
    const [colors,setColors] = useState(["red", "green","blue","purple","yellow"]);
    const [open,setOpen] = useState({
        pricing:false,
        confirm:false,
        method:false
    });
    const [method,setMethod] = useState(0);
    const [methods,setMethods] = useState([
        /*{
            id:1,
            title:"VISA",
            icon:"fab fa-cc-visa",
            description:"You will subscribe for 3 months"
        },*/
        {
            id:2,
            title:"Airtel Money or Mpamba",
            icon:"fab fa-cc-paypal",
            description:"We will redirect to paychangu. Follow the steps"
        },
        {
            id:3,
            title:"Money Transfer",
            icon:"fa fa-money-bill-transfer",
            description:"Deposit money to our bank"
        }
    ]);
    const [form,setForm] = useState({
        phone_number:"",
        transId:""
    })

    const makePayment = () => {
        let random = Math.floor((Math.random() * 1000000000) + 1);
        $.post("api/", {saveRef:random,type:"fees",package:active.id}, res=>{
            PaychanguCheckout({
                "public_key": "pub-live-AkdzhBXueOLvshxcT4icXi8xg9L1WhMB",
                "tx_ref": '' + random,
                "amount": active.price,
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

    const getData = () => {
        $.get("api/", {getDashboardData:"true"}, function(res){
            setData({...data, ...res});
        })

        $.get("api/", {getSubscriptions:"true"}, res=>setSubscriptions(res));
    }

    const getPackages = () => {
        $.get("api/", {getPackages:"true"}, res=>setPackages(res));
    }

    const numberFormat = (num) => {
        return new Intl.NumberFormat().format(num);
    }

    useEffect(()=>{
        getData();
        getPackages();
    }, []);

    useEffect(()=>{
        if(subscriptions.length > 0){
            setHasSubscribed(true);
        }
    }, [subscriptions]);

    return (
        <>
            <div className="w3-row">
                <div className="w3-half p-2">
                    {subscriptions.map((row,index)=>(
                        <Paper className="p-3 mt-3 w3-round-xlarge">
                            <div className="clearfix">
                                <font>{row.package_data.name}</font> | 
                                <Typography variant="body2" color="text.secondary" sx={{px:3,display:"inline-block"}}>{row.package_data.duration} months</Typography> | 
                                <span className="badge bg-red-100 p-2 ml-2">Expires: {row.expires}</span>
                                <Button variant="outlined" sx={styles.smallBtn} className="float-right">Renew</Button>
                            </div>
                        </Paper>
                    ))}

                    {subscriptions.length == 0 && <div>
                        <Alert severity="error">You do not have an active subscription</Alert>
                    </div>}
                </div>

                <div className="w3-half p-3">
                    <Button onClick={e=>setOpen({...open, pricing:true})}>Browse Packages</Button>
                </div>
            </div>


            <div className="w3-modal" style={{display:(open.pricing?"block":"none"),zIndex:4001}} >
                <div className="w3-modal-content p-3 rounded-xl" style={{width:"640px"}}>
                    <CloseHeading label="Choose Your plan" onClose={()=>setOpen({...open, pricing:false})} />

                    <div class="flex w-full gap-2 mt-2 mb-2">
                        {packages.map((row,index)=>(
                            <div class="flex-1">
                                <div className="ms-shadow p-2 rounded w3-center pointer hover:bg-blue-100" onClick={e=>{
                                    setActive(row);
                                    setOpen({...open, pricing:false, method:true});
                                }}>
                                    <div className={`bg-${colors[index]}-200 rounded p-2`}>
                                        <font className={`block text-${colors[index]}-800 text-bold font-bold text-uppercase text-lg`}>{row.name}</font>
                                        <font className="block text-sm my-2" style={{lineHeight: 1.5, height: "calc(2 * 1.5em)", overflow: "hidden"}}>{row.description}</font>
                                    </div>
                                    <div className="text-center py-2 pt-3">
                                        <font className="font-bold text-xl sansmedium block">K{format.format(row.price)}/mo</font>
                                        <font className="w3-small w3-opacity">{row.businesses} businesses</font>
                                    </div>
                                    <Divider/>
                                    <div className="w3-center py-2">
                                        {row.duration} months
                                    </div>
                                    <Divider/>
                                    <Box sx={{py:2}}>
                                        <Button variant="outlined" fullWidth>Get this plan</Button>
                                    </Box>
                                </div>
                            </div>
                        ))}
                    </div>
                    <BottomClose onClose={()=>setOpen({...open, pricing:false})} />
                </div>
            </div>

            <Dialog open={open.method} onClose={()=>setOpen({...open, method:false})}>
                <div className="p-3" style={{width:"450px"}}>
                    <CloseHeading label="Payment Method" onClose={()=>setOpen({...open, method:false})}/>
                    <div className="my-3">
                        {methods.map((row,index)=>(
                            <div className={"border rounded-xl p-2 mb-2 hover:bg-gray-100 pointer "+(row.id == method ? "border-primary text-primary":"")} onClick={e=>setMethod(row.id)}>
                                <div className="w3-row">
                                    <div className="w3-col m2 w3-center">
                                        <i className={row.icon+" w3-xlarge"} />
                                    </div>
                                    <div className="w3-col m9">
                                        <font className="block">{row.title}</font>
                                        <font className="block w3-small">{row.description}</font>
                                    </div>
                                    <div className="w3-col m1">
                                        <Radio checked={row.id == method} />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {method != 0 && <Button variant="outlined" onClick={e=>{
                            if(method == 2){
                                makePayment();
                            }
                            else if(method == 3){
                                setOpen({...open, method:false, confirm:true});
                            }
                            else{
                                Toast("Not implemented yet");
                            }
                        }}>
                            Continue
                        </Button>}
                    </div>
                    <BottomClose onClose={()=>setOpen({...open, method:false})}/>
                </div>
            </Dialog>

            {open.confirm && <Warning
                title="Confirm"
                secondaryText={"Are you sure that you have made a payment?"}
                width={400}
                action={{
                    text:"Confirm",
                    callback:()=>{
                        $.post("api/", {addSubscription:"true",id:active.id, ...form}, response=>{
                            try{
                                let res = JSON.parse(response);
                                if(res.status){
                                    setOpen({...open, confirm:false});
                                    //props.onCancel();
                                    getData();
                                    Toast("Success");
                                }
                                else{
                                    Toast(res.message);
                                }
                            }
                            catch(E){
                                alert(E.toString()+response);
                            }
                        })
                    }
                }}
                onClose={()=>setOpen({...open, confirm:false})}
                view={
                    <>
                        <TextField 
                            label="Enter number" 
                            helperText={"Your number you have used to send money"} 
                            size="small"
                            fullWidth
                            name="phone_number"
                            value={form.phone_number}
                            onChange={e=>setForm({...form, phone_number:e.target.value})} />

                        <TextField 
                            label="Trans ID" 
                            size="small"
                            fullWidth
                            name="trans_id"
                            sx={{mt:2}}
                            value={form.transId}
                            onChange={e=>setForm({...form, transId:e.target.value})} />
                    </>
                }
            />}
        </>
    )
}

function Profile(props){
    const [value, setValue] = React.useState(0);
    const [modals, setModals] = useState({
        editEmail:false,
        editName:false
    });
    const [user, setUser] = useState({id:0,name:"",photo:"default_avatar.png"});
  
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const choosePicture = (event) => {
        let input = document.createElement("input");
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', function (event){
            //upload
            let formdata = new FormData();
            formdata.append("change_picture", input.files[0]);

            post("api/", formdata, function (response){
                try{
                    let res = JSON.parse(response);

                    if (res.status){
                        setUser({...user, photo:res.filename});
                    }
                }
                catch (e) {
                    alert(e.toString()+response);
                }
            })
        });

        input.click();
    }

    const updateEmail = (event) => {
        $.post("api/", {updateEmail:user2.email}, function(res){
            if (res.status){
                Toast("Successfully updated email");
                setModals({...modals, editEmail:false});
                getUser();
            }
            else{
                Toast(res.message);
            }
        })
    }

    const getUser = () => {
        $.get("api/", {getUser:"true"}, function(res){
            setUser(res);
        })
    }

    const updateName = (event) => {
        $.post("api/", {updateName:user2.name}, function(res){
            if (res.status){
                Toast("Successfully updated name");
                setModals({...modals, editName:false});
                getUser();
            }
            else{
                Toast(res.message);
            }
        })
    }

    const changePassword = (event) => {
        event.preventDefault();

        let form = event.target;

        $.post("api/", {admin_new_password:form.admin_new_password.value}, function(res){
            if(res.status){
                setOpen(false)
                Toast("Success");
            }
            else{
                Toast(res.message);
            }
        })
    }

    useEffect(()=>{
        getUser();
    }, []);

    return (
        <div>
            <div className="w3-padding-large w3-large alert-warning text-dark">
                Your Profile
            </div>
            <div className="pt-30">
                <div className="w3-row">
                    <div className="w3-col m1">&nbsp;</div>
                    <div className="w3-col m3 pl-20 pr-20">
                        <img src={"../uploads/"+user.photo} width="100%" />
                    </div>
                    <div className="w3-col m8 pr-20 pl-20">
                        <Typography variant="h4" component="h1" gutterBottom>
                            {user.name}
                        </Typography>
                        <Link href="#" className="block">{user.type}</Link>
                        <FormLabel id="demo-radio-buttons-group-label" sx={{mt:4}}>Rankings</FormLabel>
                        <div className="mb-40">
                            <font style={{display:"inline-block"}} className="w3-large">3.4</font> 
                            <Rating
                                name="text-feedback"
                                value={3.5}
                                readOnly
                                precision={0.5}
                                />
                        </div>
                        <div className="">
                            <Button variant="outlined" onClick={choosePicture} startIcon={<i className="fa fa-photo w3-small" />}>
                                Choose Picture
                            </Button>

                            <Button variant="contained" sx={{ml:3}} onClick={handleClickOpen} startIcon={<i className="fa fa-lock w3-small" />}>
                                Change password
                            </Button>
                        </div>
                        <div className="pt-30">
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="About" icon={<i className="far fa-user" />} iconPosition="start" {...a11yProps(0)} />
                                        <Tab label="Activity Log" icon={<i className="fa fa-list-ol" />} iconPosition="start" {...a11yProps(1)} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={value} index={0}>
                                    <FormLabel id="demo-radio-buttons-group-label">BASIC INFORMATION</FormLabel>
                                    <div className="w3-row pt-15">
                                        <div className="w3-col m2">
                                            <font className="bold">Email:</font>
                                        </div>
                                        <div className="w3-col m9">
                                            <Link href="#" onClick={e=>{
                                                setModals({...modals, editEmail: true});
                                            }
                                            }>{user.email}</Link>
                                        </div>
                                    </div>
                                    <div className="w3-row pt-15">
                                        <div className="w3-col m2">
                                            <font className="bold">Name:</font>
                                        </div>
                                        <div className="w3-col m9">
                                            <Link href="#" onClick={e=>setModals({...modals, editName: true})}>{user.name}</Link>
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    Expired
                                </TabPanel>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                size="small"
                >
                <DialogTitle id="alert-dialog-title">
                    Change password
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        &nbsp;
                    </DialogContentText>
                    <form onSubmit={changePassword}>
                        <TextField
                            id="filled-password-input"
                            label="Enter new Password"
                            name="admin_new_password"
                            fullWidth
                            type="password"
                            sx={{mb:3, mt:2}}
                            size="small" />

                        <Button type="submit" role="submit" sx={{mt:2}} variant="contained">Save Changes</Button>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <div className={"w3-modal"} style={{display:(modals.editEmail?"block":"none")}}>
                <div className={"w3-modal-content w3-round-large shadow w3-padding"} style={{width:"370px"}}>
                    <font className={"w3-large block"}>Edit Email</font>
                    <TextField 
                        label={"Change Email"} 
                        sx={{mt:3}} 
                        value={user.email} 
                        onChange={e=>setUser({...user, email:e.target.value})} 
                        fullWidth size={"small"} />

                    <div className={"w3-row pt-30 pb-15"}>
                        <div className={"w3-half w3-padding"}>
                            <Button fullWidth variant={"outlined"} onClick={e=>setModals({...modals, editEmail:false})}>Close</Button>
                        </div>
                        <div className={"w3-half w3-padding"}>
                            <Button fullWidth variant={"contained"} onClick={updateEmail}>Update</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={"w3-modal"} style={{display:(modals.editName?"block":"none")}}>
                <div className={"w3-modal-content w3-round-large shadow w3-padding"} style={{width:"370px"}}>
                    <font className={"w3-large block"}>Edit Name</font>
                    <TextField 
                        label={"Change Name"} 
                        sx={{mt:3}} 
                        value={user.name} 
                        onChange={e=>setUser({...user, name:e.target.value})} 
                        fullWidth 
                        size={"small"} />

                    <div className={"w3-row pt-30 pb-15"}>
                        <div className={"w3-half w3-padding"}>
                            <Button fullWidth variant={"outlined"} onClick={e=>setModals({...modals, editName:false})}>Close</Button>
                        </div>
                        <div className={"w3-half w3-padding"}>
                            <Button fullWidth variant={"contained"} onClick={updateName}>Update</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CloseHeading(props){
    return (
        <>
            <div className={"clearfix "+(props.className != undefined ? props.className : "")}>
                <font className="w3-large">{props.label}</font>

                <span className="bg-gray-200 w3-round-large bcenter float-right pointer hover:bg-gray-300" onClick={e=>{
                    if(props.onClose != undefined){
                        props.onClose(e);
                    }
                }} style={{height:"36px",width:"36px"}}>
                    <i className="fa fa-times text-lg"/>
                </span>
            </div>
        </>
    )
}

function BottomClose(props){
    return (
        <>
            <div className={"clearfix "+(props.className != undefined ? props.className : "")}>
                <Button variant="contained" color="error" className="float-right" onClick={e=>{
                    if(props.onClose != undefined){
                        props.onClose(e);
                    }
                }} style={{textTransform:"none"}}>
                    Close
                </Button>
            </div>
        </>
    )
}

function Warning(props){
    const [open,setOpen] = useState(true);

    useEffect(()=>{
        if(!open){
            if(props.onClose!= undefined){
                props.onClose();
            }
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={()=>{
            setOpen(false)
            if(props.onClose!= undefined){
                props.onClose();
            }
        }}>
            <div className="w3-padding-large" style={{width:"300px"}}>
                {props.title != undefined && <font className="w3-large block mb-30 block">{props.title}</font>}

                {props.secondaryText != undefined && <font className="block mb-15">{props.secondaryText}</font>}

                {props.view != undefined && <div className="py-2">{props.view}</div>}
                
                <div className="py-2 clearfix">
                    <Button variant="contained" color="error" className="w3-round-xxlarge" sx={{textTransform:"none"}} onClick={event=>{
                        setOpen(false)
                        if(props.onClose!= undefined){
                            props.onClose();
                        }
                    }}>Close</Button>
                    <span className="float-right">
                        
                        {props.action != undefined && <Button sx={{textTransform:"none"}} className="w3-round-xxlarge" variant="contained" onClick={event=>{
                            //setLogout(false);
                            props.action.callback();
                        }}>{props.action.text}</Button>}
                    </span>
                </div>
            </div>
        </Dialog>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

function Registration(){
    const [subjects,setSubjects] = useState([]);
    const [data,setData] = useState({
        form:1,
        subjects:JSON.stringify(subjects),
        setRegistration:"true"
    })

    const getSubjects = () => {
        $.get("api/", {getSubjects:"true"}, res=>setSubjects(res));
    }

    const getRegistration = () =>{
        $.get("api/", {getRegistration:"true"}, res=>setData({...data, ...res}));
    }

    useEffect(()=>{
        getSubjects();
        getRegistration();
    }, []);

    useEffect(()=>{
        if(subjects.length > 0){
            //
            setData({...data, subjects:JSON.stringify(subjects)});
        }
    }, [subjects]);

    useEffect(()=>{
        if(subjects.length > 0){
            $.post("api/", data, response=>{
                try{
                    let res = JSON.parse(response)
                    if(res.status){
                        //Toast("Success");
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        }
    }, [data])

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m3">&nbsp;</div>
                <div className="w3-col m6">
                    <Typography variant="h4" sx={{py:3}}>Registration</Typography>
                    <TextField
                        label="Form"
                        fullWidth
                        select
                        value={data.form}
                        onChange={e=>setData({...data, form:e.target.value})}
                        size="small">
                        {[1,2,3,4].map((row,index)=>(
                            <MenuItem value={row}>{row}</MenuItem>
                        ))}
                    </TextField>
                    
                    <Alert severity="info" sx={{my:3}}>Tick the subjects you want to register</Alert>

                    {subjects
                    .filter(r=>r.id != 0)
                    .map((row,index)=>(
                        <div>
                            <FormControlLabel size="small" fullWidth control={
                                <Checkbox size="small" checked={row.checked} onChange={(e)=>{
                                    setSubjects(subjects.map(r=>{
                                        if(r.id == row.id){
                                            r.checked = e.target.checked
                                        }
                                        return r;
                                    }))
                                }} />
                            } label={row.name} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

function Resources(){
    const [subjects,setSubjects] = useState([]);
    const [books,setBooks] = useState([]);
    const [subject,setSubject] = useState(0);
    const {page,setPage,user,setUser,activeBook,setActiveBook,hasSubscribed} = useContext(Context);

    const getSubjects = () => {
        $.get("api/", {getSubjects:"true"}, res=>setSubjects(res));
    }

    const getBooks = () => {
        $.get("api/", {getBooks:"true"}, res=>setBooks(res));
    }

    useEffect(()=>{
        getSubjects();
        getBooks();
    }, []);

    return (
        <>
            {hasSubscribed ?
            <div className="p-3">
                <div className="py-2">
                    {subjects
                    .filter(r => (r.checked || r.id == 0))
                    .map((row,index)=>(
                        <Chip label={row.name} variant={row.id != subject ? "outlined":"contained"} onClick={e=>setSubject(row.id)} color="primary" sx={{ml:1}} />
                    ))}
                </div>

                <div className="w3-responsive">
                    <div className="w3-row" style={{width:(books.length*200)+"px"}}>
                        {books
                        .filter(r=> subject == 0 || r.subject == subject)
                        .map((row,index)=>(
                            <BookView data={row} onClick={e=>{
                                setActiveBook(row);
                                setPage("View")
                            }} />
                        ))}
                    </div>
                </div>

                <Typography variant="h6" sx={{pl:3,py:2}}>Your reading history</Typography>
                <div className="w3-responsive">
                    <div className="w3-row" style={{width:(books.length*200)+"px"}}>
                        {books.map((row,index)=>(
                            <BookView data={row} onClick={e=>{
                                setActiveBook(row);
                                setPage("View")
                            }} />
                        ))}
                    </div>
                </div>

                <Typography variant="h6" sx={{pl:3,py:2}}>Trending books</Typography>
                <div className="w3-responsive">
                    <div className="w3-row" style={{width:(books.length*200)+"px"}}>
                        {books.map((row,index)=>(
                            <BookView data={row} onClick={e=>{
                                setActiveBook(row);
                                setPage("View")
                            }} />
                        ))}
                    </div>
                </div>
            </div>:
            <Alert severity="error" sx={{m:3}}>You do not have an active subscription</Alert>}
        </>
    )
}

function BookView(props){
    return (
        <>
            <div className="w3-col px-1" style={{width:"180px"}} onClick={e=>{
                if(props.onClick != undefined){
                    props.onClick(e);
                }
            }}>
                <img src={"../uploads/"+props.data.image} width={"100%"} className="rounded"/>
                <div className="pt-1">
                    <font className="block">{props.data.title}</font>
                    <font className="block w3-small w3-opacity">{props.data.author}</font>
                </div>
            </div>
        </>
    )
}

function View(){
    const {stage,setStage,user,setUser,activeBook,setActiveBook} = useContext(Context);
    return (
        <>
            <div className="w3-row">
                <div className="w3-col m3 p-3 w3-center">
                    <img src={"../uploads/"+activeBook.image} width={"80%"} className="rounded-xl" />
                </div>
                <div className="w3-col m9 py-5">
                    <div className="py-1">Title: <b>{activeBook.title}</b></div>
                    <div className="py-1">Author: <b>{activeBook.author}</b></div>
                    <div className="py-1">Subject: <b>{activeBook.subject_data.name}</b></div>
                    <div className="py-1 mb-3">Uploaded by: <b>{activeBook.admin_data.name}</b></div>

                    <Button onClick={e=>{
                        window.open("../uploads/"+activeBook.file, "_blank").focus();
                    }}>Read Now</Button>
                </div>
            </div>
        </>
    )
}

function AvailableLessons(){
    const [subjects,setSubjects] = useState([]);
    const [books,setBooks] = useState([]);
    const [rows,setRows] = useState([]);
    const {hasSubscribed} = useContext(Context);

    const [form,setForm] = useStorage('school-form', {form:0,subject:0});

    const getSubjects = () => {
        $.get("api/", {getSubjects:"true"}, res=>setSubjects(res));
    }

    const getBooks = () => {
        $.get("api/", {getBooks:"true"}, res=>setBooks(res));
    }

    const filterRecords = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            setRows(response);
        })
    }
    
    useEffect(()=>{
        getSubjects();
        getBooks();
    }, []);

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m2">&nbsp;</div>
                <div className="w3-col m8 pt-4">
                    {hasSubscribed ?
                    <>
                        <form onSubmit={filterRecords} className="py-2">
                            <TextField 
                                label="Subject" 
                                sx={{width:180}} 
                                size="small" 
                                select 
                                value={form.subject}
                                onChange={e=>setForm({...form, subject:e.target.value})}
                                name="subject_lessons">
                                {subjects
                                .filter(r => (r.checked || r.id == 0))
                                .map((row,index)=>(
                                    <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                                ))}
                            </TextField>

                            <TextField 
                                label="Form" 
                                sx={{width:180,mx:2}} 
                                size="small" 
                                select 
                                value={form.form}
                                onChange={e=>setForm({...form, form:e.target.value})}
                                name="form">
                                {[1,2,3,4].map((row,index)=>(
                                    <MenuItem value={row} key={row}>{row}</MenuItem>
                                ))}
                            </TextField>

                            <Button variant="outlined" type="submit">Submit</Button>
                        </form>

                        <Divider/>

                        {rows.map((row,index)=>(
                            <LessonView data={row} key={row.id}/>
                        ))}

                        {rows.length == 0 && <Alert severity="error">No lessons available for this selection</Alert>}
                    </>:
                    <Alert severity="error" sx={{m:3}}>You do not have an active subscription</Alert>}
                </div>
            </div>
        </>
    )
}

function LessonView(props){
    const [data,setData] = useState(props.data);
    const {page,setPage} = useContext(Context);

    useEffect(()=>{
        setData(props.data);
    }, [props.data]);

    return (
        <>
            <div className="p-2 mt-3">
                <Card sx={{ width: '100%',borderRadius:"24px" }}>
                    <CardHeader
                        avatar={
                            <img width={40} style={{borderRadius:"50%"}} src={"../uploads/"+props.data.admin_data.picture} />
                        }
                        action={
                            <Fab size="small" sx={{boxShadow:"none"}}>
                                <i className="far fa-bookmark text-lg"/>
                            </Fab>
                        }
                        title={props.data.admin_data.name}
                        subheader={"teacher - "+props.data.ago}
                    />
                    <CardContent>
                        <Typography variant="h4">{props.data.title}</Typography>
                        <p>{props.data.text}</p>
                        <p>{props.data.attachments.length} attachments</p>

                        <Box>
                            <Button onClick={e=>{
                                localStorage.setItem("lesson", JSON.stringify(data));
                                setPage("Lesson")
                            }}>Open</Button>

                            <Button sx={{ml:1}} variant="text">Comments ({data.comments})</Button>
                            <Button sx={{ml:1}} variant="text">Attended ({data.attended})</Button>
                            <Button sx={{ml:1}} variant="text">Opened ({data.opened})</Button>
                            <Button  sx={{ml:1}} variant="text">Save <i className="far fa-bookmark ml-2"/></Button>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

function Lesson(){
    const [data,setData] = useStorage('lesson', {id:0});
    const {page,setPage} = useContext(Context);
    const [comments,setComments] = useState([]);
    const [attachments,setAttachments] = useState([]);

    const getComments = () => {
        $.get("api/", {getComments:data.id}, res=>setComments(res));
    }

    const getAttachments = () => {
        $.get("api/", {getAttachments:data.id,type:"lesson"}, res=>setAttachments(res));
    }

    const fileExtension = (filename) => {
        let chars = filename.split(".")
        return chars[chars.length-1].toLowerCase();;
    }

    const fileType = (filename) => {
        let ext = fileExtension(filename);

        if(["png","jpg","jpeg","webp","gif"].includes(ext)){
            return "img";
        }
        else{
            return ext;
        }
    }

    useEffect(()=>{
        if(data.id != 0){
            $.post("api/", {saveOpened:data.id}, res=>{
                //
            });

            getComments();
            getAttachments();
        }
    }, []);

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m1">&nbsp;</div>
                <div className="w3-col m10">
                    {data.id != 0 && <div className="p-2 mt-3">
                        <Card sx={{ width: '100%',borderRadius:"24px" }}>
                            <CardHeader
                                avatar={
                                    <img width={40} style={{borderRadius:"50%"}} src={"../uploads/"+data.admin_data.picture} />
                                }
                                action={
                                    <Fab size="small" sx={{boxShadow:"none"}}>
                                        <i className="far fa-bookmark text-lg"/>
                                    </Fab>
                                }
                                title={data.admin_data.name}
                                subheader={"teacher - "+data.ago}
                            />
                            <CardContent>
                                <Typography variant="h4">{data.title}</Typography>
                                <p>{data.text}</p>

                                <div className="flex gap-1 my-2">
                                    {attachments.map((row,index)=>(
                                        <>{fileType(row.filename) == "img" ? <>
                                            <img src={"../uploads/"+row.filename} height={"140"} className="rounded"/>
                                        </>:
                                        <>
                                            <video height={"140"} controls>
                                                <source src={"../uploads/"+row.filename} className="rounded" type="video/mp4"/>
                                            </video>
                                        </>}</>
                                    ))}
                                </div>

                                <Box sx={{mb:2}}>
                                    <Button variant="outlined">Comments ({data.comments})</Button>
                                    <Button sx={{ml:1}} variant="text">Attended ({data.attended})</Button>
                                    <Button sx={{ml:1}} variant="text">Opened ({data.opened})</Button>
                                    <Button  sx={{ml:1}} variant="text">Save <i className="far fa-bookmark ml-2"/></Button>
                                </Box>
                                <CommentBox data={data} onSuccess={()=>{
                                    getComments();
                                }} />

                                <div className="ui comments">
                                    {comments.length > 0 && <>
                                        <Divider sx={{mt:2}}/>

                                        {comments.map((row,index)=>(
                                            <CommentView2 data={row} key={row.id}/>
                                        ))}
                                    </>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>}
                </div>
            </div>
        </>
    )
}

function CommentBox(props) {
    const saveComment = (event) => {
        event.preventDefault();

        let formdata = new FormData(event.target);

        post("api/", formdata, response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    props.onSuccess();
                    Toast("Success");
                    event.target.reset();
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return (
        <>
            <form onSubmit={saveComment}>
                <input type="hidden" name="lesson_id" value={props.data.id} />
                <input type="hidden" name="parent" value={0} />
                <Box
                    component="div"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%',border:"1px solid #ddd",borderRadius:"7px" }}>
                    <IconButton sx={{ p: '7px',display:"none" }} size="small" aria-label="menu">
                        <i className="fa fa-bars" />
                    </IconButton>
                    <InputBase
                        multiline
                        rows={2}
                        sx={{ ml: 1, flex: 1 }}
                        size="small"
                        name="new_comment"
                        placeholder="Write comment"
                        required
                        inputProps={{ 'aria-label': 'search google maps' }}
                        />
                    <IconButton type="button" size="small" sx={{ p: '7px' }} aria-label="search">
                        <i className="fa fa-paperclip" />
                    </IconButton>
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton type="submit" color="primary" size="small" sx={{ p: '7px' }} aria-label="directions">
                        <i className="fa fa-location-arrow" />
                    </IconButton>
                </Box>
            </form>
        </>
    );
}

function post(url, formdata, callback){
    var ajax = new XMLHttpRequest();

    var completeHandler = function(event) {
        const contentType = ajax.getResponseHeader("Content-Type");
        console.log(contentType);
        if (contentType == "application/json") {
            try{
                callback(JSON.parse(event.target.responseText));
            }
            catch(E){
                console.error(E.toString());
                console.error("Failed to parse: "+event.target.responseText);
            }
        }
        else{
            var response = event.target.responseText;
            callback(response);
        }
    }
    
    var progressHandler = function(event) {
        //try{return obj.progress(event.loaded, event.total);}catch(E){}
    }
    
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    //ajax.addEventListener("error", errorHandler, false);
    //ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", url);
    ajax.send(formdata);
}

function CommentView(props){
    const [data,setData] = useState(props);

    return (
        <>
            <div className="mt-3">
                <>
                    <CardHeader
                        avatar={
                            <img width={40} style={{borderRadius:"50%"}} src={"../uploads/"+props.data.user_data.photo} />
                        }
                        action={
                            <></>
                        }
                        title={props.data.user_data.name}
                        subheader={props.data.user_type+" - "+props.data.ago}
                    />
                    <CardContent sx={{p:1}}>
                        <p>{props.data.comment}</p>

                        <Box>
                            <Button variant="text">Replies ({data.comments})</Button>
                            <Button sx={{ml:1}} variant="text">Like ({data.attended})</Button>
                        </Box>
                    </CardContent>
                </>
            </div>
        </>
    )
}

function CommentView2(props){
    const [open,setOpen] = useState({
        reply:false
    });
    const [replies,setReplies] = useState([]);
    const [hasLiked,setHasLiked] = useState(false);

    const getReplies = () => {
        $.get("api/", {getReplies:props.data.id}, res=>setReplies(res));
    }

    const saveComment = (event) => {
        event.preventDefault();

        let formdata = new FormData(event.target);

        post("api/", formdata, response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    getReplies();
                    Toast("Success");
                    event.target.reset();
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const toggleLike = () => {
        $.post("api/", {toggleLike:props.data.id}, response=>{
            //
            try{
                let res = JSON.parse(response);
                setHasLiked(res.hasLiked);
                Toast(res.message);
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    useEffect(()=>{
        getReplies();
    });

    return (
        <>
            <div className="comment">
                <a className="avatar">
                    <img src={"../uploads/"+props.data.user_data.photo} />
                </a>
                <div className="content">
                    <a className="author">{props.data.user_data.name}</a>
                    <div className="metadata">
                        <div className="date">{props.data.ago}</div>
                    </div>
                    <div className="text">
                        <p>{props.data.comment}</p>
                    </div>
                    <div className="actions">
                        <a className="reply" onClick={e=>setOpen({...open, reply:!open.reply})}>Reply</a>
                        <a class="save">Replies ({replies.length})</a>
                        <a class="hide">Likes ({props.data.likes})</a>
                        <a onClick={toggleLike}>
                            <i class="icon thumbs up outline"></i>
                            Like
                        </a>
                    </div>

                    <form className="ui reply form" onSubmit={saveComment} style={{display:(open.reply?"block":"none")}}>
                        <input type="hidden" name="parent" value={props.data.id} />
                        <input type="hidden" name="lesson_id" value={props.data.ref} />
                        <div className="field">
                            <textarea name="new_comment"></textarea>
                        </div>
                        <button className="ui primary submit labeled icon button" type="submit">
                            <i className="icon edit"></i> Add Reply
                        </button>
                    </form>
                </div>
                {replies.length > 0 && <>
                    <div className="comments">
                        {replies.map((row,index)=>(
                            <CommentView2 data={row} key={row.id} />
                        ))}
                    </div>
                </>}
            </div>
        </>
    )
}

// #region exams

function Exams(){
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{minHeight:"unset"}}>
                        <Tab label="Take Exam" {...a11yProps(0)} sx={{minHeight:"unset",textTransform:"none"}}/>
                        <Tab label="History"{...a11yProps(1)} sx={{minHeight:"unset",textTransform:"none"}} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <NewExam onSuccess={()=>setValue(1)} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ExamHistory />
                </TabPanel>
            </Box>
        </>
    )
}

function NewExam(props){
    const [subjects,setSubjects] = useState([]);
    const [books,setBooks] = useState([]);
    const [rows,setRows] = useState([]);
    const {hasSubscribed} = useContext(Context);

    const [form,setForm] = useStorage('school-form', {form:0,subject:0});

    const getSubjects = () => {
        $.get("api/", {getSubjects:"true"}, res=>setSubjects(res));
    }

    const getBooks = () => {
        $.get("api/", {getBooks:"true"}, res=>setBooks(res));
    }

    const filterRecords = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            setRows(response);
        })
    }
    
    useEffect(()=>{
        getSubjects();
        getBooks();
    }, []);

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m2">&nbsp;</div>
                <div className="w3-col m8 pt-4">
                    {hasSubscribed ?
                    <>
                        <form onSubmit={filterRecords} className="py-2">
                            <TextField 
                                label="Subject" 
                                sx={{width:180}} 
                                size="small" 
                                select 
                                value={form.subject}
                                onChange={e=>setForm({...form, subject:e.target.value})}
                                name="subject_exams">
                                {subjects
                                .filter(r => (r.checked || r.id == 0))
                                .map((row,index)=>(
                                    <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                                ))}
                            </TextField>

                            <TextField 
                                label="Form" 
                                sx={{width:130,ml:2}} 
                                size="small" 
                                select 
                                value={form.form}
                                onChange={e=>setForm({...form, form:e.target.value})}
                                name="form">
                                {[1,2,3,4].map((row,index)=>(
                                    <MenuItem value={row} key={row}>{row}</MenuItem>
                                ))}
                            </TextField>

                            <TextField 
                                label="Term" 
                                sx={{width:130,mx:2}} 
                                size="small" 
                                select 
                                value={form.form}
                                onChange={e=>setForm({...form, form:e.target.value})}
                                name="term">
                                {[1,2,3].map((row,index)=>(
                                    <MenuItem value={row} key={row}>{row}</MenuItem>
                                ))}
                            </TextField>

                            <Button variant="outlined" type="submit">Submit</Button>
                        </form>

                        <Divider/>

                        {rows.map((row,index)=>(
                            <ExamView data={row} key={row.id} />
                        ))}

                        {rows.length == 0 && <Alert severity="error">No exams available for this selection</Alert>}
                    </>:
                    <Alert severity="error" sx={{m:3}}>You do not have an active subscription</Alert>}
                </div>
            </div>
        </>
    )
}

function ExamView(props){
    const [data,setData] = useState(props.data);
    const {page,setPage} = useContext(Context);

    useEffect(()=>{
        setData(props.data);
    }, [props.data]);

    return (
        <>
            <div className="p-2 mt-3">
                <Card sx={{ width: '100%',borderRadius:"24px" }}>
                    <CardHeader
                        avatar={
                            <img width={40} style={{borderRadius:"50%"}} src={"../uploads/"+props.data.admin_data.picture} />
                        }
                        action={
                            <Fab size="small" sx={{boxShadow:"none"}}>
                                <i className="far fa-bookmark text-lg"/>
                            </Fab>
                        }
                        title={props.data.admin_data.name}
                        subheader={"teacher - "+props.data.ago}
                    />
                    <CardContent>
                        <Typography variant="h4">{props.data.title}</Typography>
                        <p>{props.data.text}</p>

                        <Box>
                            <Button onClick={e=>{
                                localStorage.setItem("lesson", JSON.stringify(data));
                                setPage("Exam")
                            }}>Open</Button>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

function Exam(){
    const [data,setData] = useStorage('lesson', {id:0});
    const {page,setPage} = useContext(Context);
    const [questions,setQuestions] = useState([]);
    const [attachments,setAttachments] = useState([]);

    const getComments = () => {
        $.get("api/", {getQuestions:data.id}, response=>{
            try{
                let res = JSON.parse(response);
                setQuestions(res)
            }
            catch(E){
                alert(E.toString()+response);
            }
        });
    }

    const getAttachments = () => {
        $.get("api/", {getAttachments:data.id,type:"lesson"}, res=>setAttachments(res));
    }

    const fileExtension = (filename) => {
        let chars = filename.split(".")
        return chars[chars.length-1].toLowerCase();;
    }

    const fileType = (filename) => {
        let ext = fileExtension(filename);

        if(["png","jpg","jpeg","webp","gif"].includes(ext)){
            return "img";
        }
        else{
            return ext;
        }
    }

    const saveAnswers = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    Toast("View History");
                    setPage("Exams")
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    useEffect(()=>{
        if(data.id != 0){
            getComments();
            getAttachments();
        }
    }, []);

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m1">&nbsp;</div>
                <div className="w3-col m10">
                    {data.id != 0 && <div className="p-2 mt-3">
                        <Card sx={{ width: '100%',borderRadius:"24px" }}>
                            <CardHeader
                                avatar={
                                    <img width={40} style={{borderRadius:"50%"}} src={"../uploads/"+data.admin_data.picture} />
                                }
                                action={
                                    <Fab size="small" sx={{boxShadow:"none"}}>
                                        <i className="far fa-bookmark text-lg"/>
                                    </Fab>
                                }
                                title={data.admin_data.name}
                                subheader={"teacher - "+data.ago}
                            />
                            <CardContent>
                                <Typography variant="h4">{data.title}</Typography>
                                <p>{data.text}</p>

                                <div className="flex gap-1 my-2">
                                    {attachments.map((row,index)=>(
                                        <>{fileType(row.filename) == "img" ? <>
                                            <img src={"../uploads/"+row.filename} height={"140"} className="rounded"/>
                                        </>:
                                        <>
                                            <video height={"140"} controls>
                                                <source src={"../uploads/"+row.filename} className="rounded" type="video/mp4"/>
                                            </video>
                                        </>}</>
                                    ))}
                                </div>

                                <form onSubmit={saveAnswers}>
                                    <input type="hidden" name="exam_id_answers" value={data.id}/>
                                    
                                    {questions.map((row,index)=>(
                                        <Question data={row} position={index+1}/>
                                    ))}
                                    <Box sx={{py:2}}>
                                        <Button type="submit">Submit Answers</Button>
                                    </Box>
                                </form>
                            </CardContent>
                        </Card>
                    </div>}
                </div>
            </div>
        </>
    )
}

function Question(props){
    return (
        <>
            <div className="p-3 w3-border-bottom">
                {props.position}. {props.data.question}
                <div>
                    {props.data.options.map((row,index)=>(
                        <div className="pl-3">
                            <input type="radio" name={props.data.id} value={row.id} id={"radio"+row.id}/>
                            <label className="pl-2" htmlFor={"radio"+row.id}>{row.value}</label>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

function ExamHistory(){
    const [rows,setRows] = useState([]);
    const [progress,setProgress] = useState([]);
    const [open,setOpen] = useState({
        progress:false
    });
    const [active,setActive] = useState({});

    const getRows = () => {
        $.get("api/", {getExamHistory:"true"}, res=>setRows(res));
    }

    useEffect(()=>{
        getRows();
    }, []);

    useEffect(()=>{
        if(active.id != undefined){
            $.get("api/", {getExamProgress:active.id}, res=>setProgress(res));
        }
    }, [active]);

    return (
        <>
            <div className="p-2">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Exam</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Passed</TableCell>
                            <TableCell>No. Questions</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row,index)=>(
                            <TableRow hover>
                                <TableCell padding="none" sx={{pl:2}}>{index+1}</TableCell>
                                <TableCell padding="none">{row.exam_data.title}</TableCell>
                                <TableCell padding="none">{row.course_data.name}</TableCell>
                                <TableCell padding="none">{row.score}</TableCell>
                                <TableCell padding="none">{row.pass}</TableCell>
                                <TableCell padding="none">{row.wrote}</TableCell>
                                <TableCell padding="none">{row.created_at}</TableCell>
                                <TableCell sx={{p:1}}>
                                    <Link href="#" onClick={e=>{
                                        setActive(row);
                                        setOpen({...open, progress:true});
                                    }}>View Progress</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={open.progress} onClose={()=>setOpen({...open, progress:false})} maxWidth="xl">
                <div className="p-3" style={{width:"550px"}}>
                    <CloseHeading label="View exam progress" onClose={()=>setOpen({...open, progress:false})}/>
                    {progress.map((row,index)=>(
                        <div className="py-2 w3-border-bottom">
                            {row.question_data.question}
                            {row.options.map((r,i)=>(
                                <div className={row.answer == r.id ? (row.status == "pass" ? "text-primary" : "text-danger"):""}>{r.label}. {r.value}</div>
                            ))}
                        </div>
                    ))}
                    <BottomClose onClose={()=>setOpen({...open, progress:false})}/>
                </div>
            </Dialog>
        </>
    )
}
// #endregion

