const {TextField,Button,Alert,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper,Table,
    TableHead,ThemeProvider,createTheme,
    TableRow,Tabs, Tab,Box,Chip,Typography, FormLabel,Rating,DialogTitle,DialogActions,DialogContent,DialogContentText,
    TableCell,TablePagination,Drawer,Link,MenuItem,Dialog,Input,
    TableBody,Fab
} = MaterialUI;
const {useState,useEffect,useContext,createContext} = React;

const Context = createContext({});

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
                    borderRadius:"24px"
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

window.onload = function(){
    ReactDOM.render(<ThemeProvider theme={theme}><Index /></ThemeProvider>, document.getElementById("root"));
}

function Index(){
    const [page,setPage]= useState("Home"); //Home
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
            title:"Packages",
            icon:"fa fa-user-friends"
        },
        {
            title:"Students",
            icon:"fa fa-list-ol"
        },
        {
            title:"Admins",
            icon:"fa fa-user-friends text-danger"
        },
        {
            title:"Teachers",
            icon:"fa fa-user-friends text-danger"
        },
        {
            title:"Emails",
            icon:"fa fa-envelope"
        },
        {
            title:"Settings",
            icon:"fa fa-wrench"
        },
        {
            title:"System Values",
            icon:"fa fa-list-ul"
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
        <Context.Provider value={{page,setPage}}>
            <div className="w3-row">
                <div className="w3-col w3-border-right" style={{height:window.innerHeight+"px",overflow:"auto",width:"200px"}}>
                    <div className="w3-center pt-3 pb-3">
                        <img src={"../uploads/"+settings.logo} height="40" />
                    </div>
                    {menus.map((row,index)=>(
                        <MenuButton data={row} key={row.title} isActive={page == row.title} onClick={()=>setPage(row.title)} />
                    ))}

                    <ListItem size="small" onClick={e=>{
                        window.location = '../logout.php';
                    }} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <i className={"fa fa-power-off"} />
                            </ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItemButton>
                    </ListItem>
                    
                </div>
                <div className="w3-rest" style={{height:window.innerHeight+"px",overflow:"auto"}}>
                    {page == "Home" ? <Home />:
                    page == "Faculties" ? <Faculties />:
                    page == "Students" ? <Students />:
                    page == "Programmes" ? <Programmes />:
                    page == "Teachers" ? <AvailableStaff />:
                    page == "Settings" ? <ControlPanel />:
                    page == "Packages" ? <MainPackages />:
                    page == "Emails" ? <Emails />:
                    page == "System Values" ? <Settings />:
                    page == "Business" ? <Businesses />:
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
    const {page,setPage} = useContext(Context);

    const getData = () => {
        $.get("api/", {getDashboardData:"true"}, function(res){
            setData({...data, ...res});
        })
    }

    const numberFormat = (num) => {
        return new Intl.NumberFormat().format(num);
    }

    useEffect(()=>{
        getData();
    }, []);

    return (
        <>
            
        </>
    )
}

function Profile(props){
    const [value, setValue] = React.useState(0);
    const [picture, setPicture] = React.useState(user.photo);
    const [modals, setModals] = useState({
        editEmail:false,
        editName:false
    });
    const [user2, setUser2] = useState({...user});
  
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
                        window.localStorage.setItem("user", response);
                        user = JSON.parse(window.localStorage.getItem("user"));
                        setPicture(user.photo);
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
        $.get("api/", {getCurrentUser:"true"}, function(res){
            setUser2(res);
            localStorage.setItem("user", JSON.stringify(res));
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

    return (
        <div>
            <div className="w3-padding-large w3-large alert-warning text-dark">
                Your Profile
            </div>
            <div className="pt-30">
                <div className="w3-row">
                    <div className="w3-col m1">&nbsp;</div>
                    <div className="w3-col m3 pl-20 pr-20">
                        <img src={"../uploads/"+picture} width="100%" />
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
                                            }>{user2.email}</Link>
                                        </div>
                                    </div>
                                    <div className="w3-row pt-15">
                                        <div className="w3-col m2">
                                            <font className="bold">Name:</font>
                                        </div>
                                        <div className="w3-col m9">
                                            <Link href="#" onClick={e=>setModals({...modals, editName: true})}>{user2.name}</Link>
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
            <div>
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
            </div>

            <div className={"w3-modal"} style={{display:(modals.editEmail?"block":"none")}}>
                <div className={"w3-modal-content w3-round-large shadow w3-padding"} style={{width:"370px"}}>
                    <font className={"w3-large block"}>Edit Email</font>
                    <TextField label={"Change Email"} sx={{mt:3}} value={user2.email} onChange={e=>setUser2({...user2, email:e.target.value})} fullWidth size={"small"} />

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
                    <TextField label={"Change Name"} sx={{mt:3}} value={user2.name} onChange={e=>setUser2({...user2, name:e.target.value})} fullWidth size={"small"} />

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

function Emails(){
    const [emails,setEmails] = useState([]);
    const [email,setEmail] = useState("");
    const [heads,setHeads] = useState([]);
    const [stage,setStage] = useState("");
    const [search,setSearch] = useState("");
    const [active,setActive] = useState({});

    const getEmails = () => {
        //$.get("api/", {getEmails:"true"}, res=>setEmails(res));
    }

    const getEmailHeads = () => {
        //$.get("api/", {getEmailHeads:email},res=>setHeads(res));
    }

    useEffect(()=>{
        getEmails();
    }, []);

    useEffect(()=>{
        if(email != ""){
            getEmailHeads();
        }
        else{
            setHeads([]);
        }
    }, [email])

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m2 w3-border-right" style={{height:window.innerHeight+"px",overflow:"auto"}}>
                    <div className="w3-padding-small">
                        <input type="text" className="form-control" placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} />
                    </div>
                    {emails
                    .filter(r=>r.receiver.toLowerCase().indexOf(search.toLowerCase()) != -1)
                    .map((row,index)=>(
                        <div className={"w3-padding pointer hover:bg-gray-100 "+(row.receiver == email ? "bg-gray-100":"")} key={row.receiver} onClick={e=>{
                            setEmail(row.receiver);
                            setStage("heads");
                        }}>{row.receiver}</div>
                    ))}
                </div>
                <div className="w3-col m10" style={{height:window.innerHeight+"px",overflow:"auto"}}>
                    {stage == "heads" ?
                    <>
                        {heads.map((row,index)=>(
                            <div className="w3-padding w3-border-bottom" onClick={e=>{
                                setActive(row);
                                setStage("view");
                            }}>
                                <font className="text-lg block">{row.subject}</font>
                                <p>{row.text}</p>
                            </div>
                        ))}
                    </>:
                    stage == "view" ? <>
                        <div className="w3-padding">
                            <Chip label="Go back" icon={<i className="fa fa-arrow-left"/>} variant="outlined" onClick={e=>setStage("heads")} />
                            <Chip label="Resend" sx={{ml:2}} icon={<i className="fa fa-undo"/>} variant="outlined" onClick={e=>setStage("heads")} />
                            <Chip label="Delete" sx={{ml:2}} icon={<i className="fa fa-trash"/>} color="error" variant="outlined" onClick={e=>setStage("heads")} />
                        </div>
                        <iframe src={"api/preview-email.php?id="+active.id} style={{width:"100%",border:"none",height:"700px"}}></iframe>
                    </>:
                    ""}
                </div>
            </div>
        </>
    )
}

function CloseHeading(props){
    return (
        <>
            <div className={"clearfix "+(props.className != undefined ? props.className : "")}>
                <font className="w3-large sansmedium">{props.label}</font>

                <span className="bg-gray-2001 w3-round-large bcenter float-right pointer hover:bg-gray-300 border" onClick={e=>{
                    if(props.onClose != undefined){
                        props.onClose(e);
                    }
                }} style={{height:"30px",width:"30px"}}>
                    <i className="fa fa-times"/>
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

function AvailableStaff(){
    const [rows,setRows] = useState([]);
    const [permissions,setPermissions] = useState([]);
    const [active,setActive] = useState({});
    const [open,setOpen] = useState({
        add:false,
        edit:false,
        delete:false
    });
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const saveStaff = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);

                if(res.status){
                    Toast("Success");
                    getRows();
                    setOpen({...open, add:false});
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

    const editStaff = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);

                if(res.status){
                    Toast("Success");
                    getRows();
                    setOpen({...open, edit:false});
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

    const getRows = () => {
        $.get("api/", {getStaff:"true"}, res=>setRows(res));
    }

    useEffect(()=>{
        getRows();
    }, []);

    return (
        <>
            <Box sx={{p:2}}>
                <Button variant="contained" sx={{textTransform:"none"}} onClick={e=>setOpen({...open, add:true})}>Add Staff</Button>
            </Box>
            <Paper sx={{m:2}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Picture</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row,index)=>(
                            <TableRow>
                                <TableCell padding="none" sx={{pl:2}}>{index+1}</TableCell>
                                <TableCell padding="none">{row.name}</TableCell>
                                <TableCell padding="none">{row.email}</TableCell>
                                <TableCell padding="none">{row.phone}</TableCell>
                                <TableCell padding="none">{row.picture}</TableCell>
                                <TableCell padding="none">{row.status}</TableCell>
                                <TableCell sx={{padding:"7px"}}>
                                    <Link href="#" onClick={e=>{
                                        setActive(row);
                                        setOpen({...open, edit:true});
                                    }}>Edit</Link>
                                    
                                    <Link href="#" sx={{ml:2}} color="error" onClick={e=>{
                                        setActive(row);
                                        setOpen({...open, delete:true});
                                    }}>Delete</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={open.add} onClose={()=>setOpen({...open, add:false})}>
                <div className="p-3" style={{width:"400px"}}>
                    <CloseHeading label="Add Staff" onClose={()=>setOpen({...open, add:false})}/>
                    <form onSubmit={saveStaff}>
                        <TextField label="Staff Name" fullWidth size="small" name="new_staff_name" sx={{mt:2}} />
                        <TextField label="Email" fullWidth size="small" name="email" sx={{mt:2}} />
                        <TextField label="Phone" fullWidth size="small" name="phone" sx={{mt:2,mb:3}} />
                        
                        <Button variant="contained" type="submit">Submit</Button>
                    </form>
                    <BottomClose onClose={()=>setOpen({...open, add:false})}/>
                </div>
            </Dialog>

            <Drawer anchor="right" open={open.edit} onClose={()=>setOpen({...open, edit:false})}>
                <div className="p-3" style={{width:"320px"}}>
                    <CloseHeading label="Edit Staff" onClose={()=>setOpen({...open, edit:false})}/>
                    <form onSubmit={editStaff}>
                        <input type="hidden" name="edit_staff_id" value={active.id} />
                        <TextField 
                            label="Staff Name" 
                            fullWidth 
                            size="small" 
                            name="edit_staff_name" 
                            value={active.name} 
                            onChange={e=>setActive({...active, name:e.target.value})} 
                            sx={{mt:2}} />
                        <TextField 
                            label="Email" 
                            fullWidth 
                            size="small" 
                            name="email" 
                            value={active.email} 
                            onChange={e=>setActive({...active, email:e.target.value})} 
                            sx={{mt:2}} />
                        <TextField 
                            label="Phone" 
                            fullWidth 
                            size="small" 
                            name="phone" 
                            value={active.phone} 
                            onChange={e=>setActive({...active, phone:e.target.value})} 
                            sx={{mt:2}} />
                        <TextField 
                            label="National ID" 
                            fullWidth 
                            size="small" 
                            name="national_id" 
                            value={active.national_id} 
                            onChange={e=>setActive({...active, national_id:e.target.value})} 
                            sx={{mt:2}} />
                        <TextField 
                            label="Employment No." 
                            fullWidth 
                            size="small" 
                            name="emp_no" 
                            value={active.employement_number} 
                            onChange={e=>setActive({...active, employement_number:e.target.value})} 
                            sx={{mt:2}} />
                        <TextField 
                            label="Emergency Contact" 
                            fullWidth 
                            size="small" 
                            multiline 
                            rows={3} 
                            name="emergency" 
                            value={active.emergency_contact} 
                            onChange={e=>setActive({...active, emergency_contact:e.target.value})}
                            sx={{mt:2,mb:3}} />

                        <hr/>
                        <div className="mb-2">
                            {permissions.map((row,index)=>(
                                <div>
                                    <input type="checkbox" name={row.id} id={"perm_"+row.id} checked={selectedPermissions.includes(row.id)} onChange={e=>{
                                        if(selectedPermissions.includes(row.id)){
                                            setSelectedPermissions(selectedPermissions.map(r=>r!=row.id));
                                        }
                                        else{
                                            setSelectedPermissions([...selectedPermissions, row.id]);
                                        }
                                    }} />
                                    <label htmlFor={"perm_"+row.id}>{row.name}</label>
                                </div>
                            ))}
                        </div>
                        <Button variant="contained" type="submit">Submit</Button>
                    </form>
                    <BottomClose onClose={()=>setOpen({...open, edit:false})}/>
                </div>
            </Drawer>

            {open.delete && <Warning
                title="Delete Staff"
                secondaryText={`Are you sure you want to delete ${active.name} ?`}
                action={{
                    text:"Confirm",
                    callback:()=>{
                        $.post("api/", {deleteStaff:active.id,vf:"true"}, response=>{
                            try{
                                let res = JSON.parse(response);
                                if(res.status){
                                    setOpen({...open, delete:false});
                                    //props.onCancel();
                                    Toast("Success");
                                    getRows();
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
                onClose={()=>setOpen({...open, delete:false})}
            />}
        </>
    )
}

function Students(){
    const [rows,setRows] = useState([]);
    const [permissions,setPermissions] = useState([]);
    const [active,setActive] = useState({});
    const [open,setOpen] = useState({
        add:false,
        edit:false
    });
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const saveStaff = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);

                if(res.status){
                    Toast("Success");
                    getRows();
                    setOpen({...open, add:false});
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

    const editStaff = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);

                if(res.status){
                    Toast("Success");
                    getRows();
                    setOpen({...open, edit:false});
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

    const getRows = () => {
        $.get("api/", {getStudents:"true"}, res=>setRows(res));
    }

    useEffect(()=>{
        getRows();
    }, []);

    return (
        <>
            <Box sx={{m:2}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Picture</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row,index)=>(
                            <TableRow>
                                <TableCell padding="none" sx={{pl:2}}>{index+1}</TableCell>
                                <TableCell padding="none">{row.name}</TableCell>
                                <TableCell padding="none">{row.email}</TableCell>
                                <TableCell padding="none">{row.phone}</TableCell>
                                <TableCell padding="none">{row.picture}</TableCell>
                                <TableCell padding="none">{row.status}</TableCell>
                                <TableCell sx={{padding:"7px"}}>
                                    <Link href="#" size="small" onClick={e=>{
                                        setActive(row);
                                        setOpen({...open, edit:true});
                                    }}>Edit</Link>
                                    
                                    <Link href="#" size="small" color="error" sx={{ml:2}} onClick={e=>{
                                        setActive(row);
                                        setOpen({...open, delete:true});
                                    }}>Delete</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {open.delete && <Warning
                title="Delete Student"
                secondaryText={`Are you sure you want to delete ${active.name} ?`}
                action={{
                    text:"Confirm",
                    callback:()=>{
                        $.post("api/", {deleteStudent:active.id,vf:"true"}, response=>{
                            try{
                                let res = JSON.parse(response);
                                if(res.status){
                                    setOpen({...open, delete:false});
                                    //props.onCancel();
                                    Toast("Success");
                                    getRows();
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
                onClose={()=>setOpen({...open, delete:false})}
            />}
        </>
    )
}

function ControlPanel(){
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <div>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Subjects" {...a11yProps(0)} style={{textTransform:"none"}} />
                            <Tab label="History" {...a11yProps(1)} style={{textTransform:"none"}} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Subjects/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <p>We dont know</p>
                    </TabPanel>
                </Box>
            </div>
        </>
    )
}

function MainPackages(){
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{minHeight:"unset"}}>
                        <Tab label="Packages" {...a11yProps(0)} sx={{minHeight:"unset"}}/>
                        <Tab label="Subscriptions"{...a11yProps(1)} sx={{minHeight:"unset"}} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Packages />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Subscriptions />
                </TabPanel>
            </Box>
        </>
    )
}

function Packages(){
    const [rows,setRows] = useState([]);
    const [open,setOpen] = useState({
        add:false,
        edit:false
    });
    const [search,setSearch] = useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    
    const [active,setActive] = useState({})
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getRows = () => {
        $.get("api/", {getPackages:"true"}, res=>setRows(res));
    }

    const save = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    getRows();
                    setOpen({...open, add:false});
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

    const edit = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    getRows();
                    setOpen({...open, edit:false});
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    useEffect(()=>{
        getRows();
    }, []);

    return (
        <>
            <Box sx={{p:2}}>
                <Button variant="contained" sx={{textTransform:"none"}} onClick={e=>setOpen({...open, add:true})}>Add Package</Button>
            </Box>
            <Box sx={{m:2,width:600}}>
                <Input sx={{m:2}} placeholder="Seach table" value={search} onChange={e=>setSearch(e.target.value)}/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Duration(mo)</TableCell>
                            <TableCell>Subsrictions</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                        .filter(r=>r.name.toLowerCase().indexOf(search.toLowerCase()) != -1)
                        .slice(page*rowsPerPage, (page+1)*rowsPerPage)
                        .map((row,index)=>(
                            <TableRow hover key={row.id} sx={{background:(index % 2 == 0 ? "rgba(0, 0, 0, 0.04)":"#fff")}}>
                                <TableCell padding="none" sx={{pl:2}}>{index+1}</TableCell>
                                <TableCell padding="none">{row.name}</TableCell>
                                <TableCell padding="none">{row.price}</TableCell>
                                <TableCell padding="none">{row.duration}</TableCell>
                                <TableCell padding="none">{row.subscriptions}</TableCell>
                                <TableCell sx={{p:1}}>
                                    <Link href="#" onClick={e=>{
                                        setActive(row);
                                        setOpen({...open, edit:true});
                                    }}>Edit</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
            </Box>

            <Dialog open={open.add} onClose={()=>setOpen({...open, add:false})}>
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <CloseHeading label="Add Package" onClose={()=>setOpen({...open, add:false})}/>
                    <form onSubmit={save}>
                        <TextField label="Package Name" fullWidth size="small" name="new_package" sx={{mt:2}} />
                        <TextField label="Durations(months)" fullWidth size="small" name="duration" type="number" sx={{mt:2}} />
                        <TextField label="Price" fullWidth size="small" name="price" sx={{mt:2}} />
                        <TextField label="Description" fullWidth size="small" multiline rows={3} name="description" sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Submit</Button>
                    </form>
                    <BottomClose onClose={()=>setOpen({...open, add:false})}/>
                </div>
            </Dialog>

            <Drawer anchor="right" open={open.edit} onClose={()=>setOpen({...open, edit:false})}>
                <div className="p-3" style={{width:"340px"}}>
                    <CloseHeading label="Edit Package" onClose={()=>setOpen({...open, edit:false})}/>
                    <form onSubmit={edit}>
                        <input type="hidden" name="package_id" value={active.id} />
                        <TextField 
                            label="Package Name" 
                            fullWidth 
                            size="small" 
                            name="edit_package" 
                            value={active.name} 
                            onChange={e=>setActive({...active, name:e.target.value})} 
                            sx={{mt:2}} />
                        <TextField 
                            label="Durations(months)" 
                            fullWidth 
                            size="small" 
                            name="duration" 
                            type="number"
                            value={active.duration} 
                            onChange={e=>setActive({...active, duration:e.target.value})} 
                            sx={{mt:2}} />

                        <TextField 
                            label="Price" 
                            fullWidth 
                            size="small" 
                            name="price" 
                            value={active.price} 
                            onChange={e=>setActive({...active, price:e.target.value})} 
                            sx={{mt:2}} />
                        <TextField 
                            label="Description" 
                            fullWidth 
                            size="small" 
                            value={active.description} 
                            multiline
                            rows={3}
                            onChange={e=>setActive({...active, description:e.target.value})} 
                            name="description" 
                            sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Submit</Button>
                    </form>
                    <BottomClose onClose={()=>setOpen({...open, edit:false})}/>
                </div>
            </Drawer>
        </>
    )
}

function Subscriptions(){
    const [rows,setRows] = useState([]);
    const [status,setStatus] = useState("");
    const [open,setOpen] = useState({
        confirm:false
    });
    const [active,setActive] = useState({
        package_data:{},
        user_data:{}
    });

    const textClasses = {
        active:"",
        pending:"text-warning",
        rejected:"text-danger"
    }

    const getRows = () => {
        $.get("api/", {getSubscriptions:"true"}, res=>setRows(res));
    }

    const reject = () => {
        $.post("api/", {rejectSubscription:active.id}, res=>{
            Toast(res);
            setOpen({...open, confirm:false});
            getRows();
        })
    }

    const confirmSub = () => {
        $.post("api/", {confirmSubscription:active.id}, res=>{
            Toast(res);
            setOpen({...open, confirm:false});
            getRows();
        })
    }

    useEffect(()=>{
        getRows();
    }, []);

    return (
        <>
            <Box sx={{m:2}}>
                Filter by status <select value={status} onChange={e=>setStatus(e.target.value)}>
                    <option value={""}>--Choose--</option>
                    {["active","pending","rejected","expired"].map((row,index)=>(
                        <option key={row} value={row}>{row}</option>
                    ))}
                </select>
            </Box>

            <Paper sx={{m:2}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Package</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Trans ID</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                        .filter(r=>r.status == status || status == "")
                        .map((row,index) => (
                            <TableRow hover key={row.id}>
                                <TableCell padding="none" sx={{pl:2}}>{index+1}</TableCell>
                                <TableCell padding="none">{row.user_data.name}</TableCell>
                                <TableCell padding="none">{row.package_data.name}</TableCell>
                                <TableCell padding="none">{row.start_date}</TableCell>
                                <TableCell padding="none">{row.end_date}</TableCell>
                                <TableCell 
                                    padding="none"
                                    onClick={e=>{
                                        setActive(row);
                                        setOpen({...open, confirm:true});
                                    }} 
                                    className={"pointer "+(textClasses[row.status])}>{row.status}</TableCell>
                                <TableCell padding="none">{row.phone}</TableCell>
                                <TableCell padding="none">{row.trans}</TableCell>
                                <TableCell sx={{padding:"7px"}}>
                                    <Button variant="outlined" sx={styles.smallBtn} size="small">Manage</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={open.confirm} onClose={()=>setOpen({...open, confirm:false})}>
                <div className="p-3" style={{width:"400px"}}>
                    <CloseHeading label="Confirm Subscription" onClose={()=>setOpen({...open, confirm:false})}/>

                    <div className="my-3 border p-2 rounded-lg">
                        <div className="block">Amount: <b>{active.package_data.price}</b></div>
                        <div className="block">Sender: <b>{active.phone}</b></div>
                        <div className="block">Trans ID: <b>{active.trans}</b></div>

                        <div className="pt-2">
                            <Button color="error" onClick={reject}>Reject</Button>
                            <Button sx={{ml:2}} onClick={confirmSub}>Confirm</Button>
                        </div>
                    </div>

                    <BottomClose onClose={()=>setOpen({...open, confirm:false})}/>
                </div>
            </Dialog>
        </>
    )
}

function Businesses(){
    const [rows,setRows] = useState([]);
    const [status,setStatus] = useState("");
    const [open,setOpen] = useState({
        confirm:false
    });
    const [active,setActive] = useState({
        package_data:{},
        user_data:{}
    });

    const textClasses = {
        active:"",
        pending:"text-warning",
        rejected:"text-danger"
    }

    const getRows = () => {
        $.get("api/", {getBusinesses:"true"}, res=>setRows(res));
    }

    const reject = () => {
        $.post("api/", {rejectSubscription:active.id}, res=>{
            Toast(res);
            setOpen({...open, confirm:false});
            getRows();
        })
    }

    const confirmSub = () => {
        $.post("api/", {confirmSubscription:active.id}, res=>{
            Toast(res);
            setOpen({...open, confirm:false});
            getRows();
        })
    }

    useEffect(()=>{
        getRows();
    }, []);

    return (
        <>
            <Box sx={{m:2}}>
                Filter by status <select value={status} onChange={e=>setStatus(e.target.value)}>
                    <option value={""}>--Choose--</option>
                    {["active","pending","rejected","expired"].map((row,index)=>(
                        <option key={row} value={row}>{row}</option>
                    ))}
                </select>
            </Box>

            <Paper sx={{m:2}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Business</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Picture</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                        .filter(r=>r.status == status || status == "")
                        .map((row,index) => (
                            <TableRow hover key={row.id} sx={{background:(index % 2 == 0 ? "rgba(0, 0, 0, 0.04)":"#fff")}}>
                                <TableCell padding="none" sx={{pl:2}}>{index+1}</TableCell>
                                <TableCell padding="none">{row.user_data.name}</TableCell>
                                <TableCell padding="none">{row.name}</TableCell>
                                <TableCell padding="none">{row.contact}</TableCell>
                                <TableCell padding="none">{row.country_data.name}</TableCell>
                                <TableCell padding="none">{row.date}</TableCell>
                                <TableCell padding="none">{row.picture}</TableCell>
                                <TableCell padding="none">{row.status}</TableCell>
                                <TableCell sx={{padding:"7px"}}>
                                    <Button variant="outlined" sx={styles.smallBtn} size="small">Manage</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={open.confirm} onClose={()=>setOpen({...open, confirm:false})}>
                <div className="p-3" style={{width:"400px"}}>
                    <CloseHeading label="Confirm Subscription" onClose={()=>setOpen({...open, confirm:false})}/>

                    <div className="my-3 border p-2 rounded-lg">
                        <div className="block">Amount: <b>{active.package_data.price}</b></div>
                        <div className="block">Sender: <b>{active.phone}</b></div>
                        <div className="block">Trans ID: <b>{active.trans}</b></div>

                        <div className="pt-2">
                            <Button color="error" onClick={reject}>Reject</Button>
                            <Button sx={{ml:2}} onClick={confirmSub}>Confirm</Button>
                        </div>
                    </div>

                    <BottomClose onClose={()=>setOpen({...open, confirm:false})}/>
                </div>
            </Dialog>
        </>
    )
}

function Settings(){
    const [rows,setRows] = useState([]);
    const [keys,setKeys] = useState([]);
    const [data,setData] = useState({});

    const getRows = () =>{
        $.get("api/", {getSettings:"true"}, res=>{
            setRows(res.rows);
            setData(res.data);
        });
    }

    const saveData = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
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

    const getValue = (name) => {
        let v = {};

        rows.map(r=>{
            if(r.name == name){
                v = r
            }
        });

        return v;
    }

    const uploadPicture  = (name) => {
        let input = document.createElement("input");
        input.type = 'file';
        input.accept = 'image/*'

        input.addEventListener('change', event=>{
            let formdata = new FormData();
            formdata.append("settings_picture", input.files[0]);
            formdata.append("name", name);

            post("api/", formdata, response=>{
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        setData({...data, [name]:res.picture});
                        Toast("Success");
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        });

        input.click();
    }

    useEffect(()=>{
        let empty = [];
        for (let k in data){
            empty.push(k);
        }
        setKeys(empty);
    }, [data]);

    useEffect(()=>{
        getRows();
    }, []);

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m3">&nbsp;</div>
                <div className="w3-col m5 pb-3">
                    <h1>&nbsp;</h1>

                    <Typography>Update System Values</Typography>
                    <Box sx={{py:3}} className="w3-center">
                        <img src={"../uploads/"+data.logo} width={"120"} className="rounded" />
                        <br/>
                        <br/>
                        <Button variant="outlined" size="small" sx={{textTransform:"none"}} onClick={e=>uploadPicture('logo')}>Choose Picture</Button>
                    </Box>
                    <form onSubmit={saveData}>
                        <input type="hidden" name="updateSettings" value={"true"} />
                        {keys
                        .filter(r=>r.name != "logo")
                        .map((row,index)=>(
                            <div className="">
                                <TextField 
                                    fullWidth 
                                    size="small" 
                                    name={row} 
                                    value={data[row]} 
                                    onChange={e=>setData({...data, [row]:e.target.value})} 
                                    sx={{mt:2}} 
                                    multiline={getValue(row).type == "longtext"}
                                    rows={getValue(row).type == "longtext" ? 3 : 1}
                                    label={row}/>
                            </div>
                        ))}

                        <Button variant="contained" sx={{mt:3, px:3}} type="submit" className="w3-round-jumbo">Update</Button>
                    </form>
                </div>
            </div>
        </>
    )
}

function Subjects(){
    const [rows,setRows] = useState([]);
    const [open,setOpen] = useState({
        add:false,
        edit:false
    });

    const getRows = () => {
        $.get("api/", {getSubjects:"true"}, res=>setRows(res));
    }

    const save = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                
                if(res.status){
                    Toast("Success");
                    getRows();
                    setOpen({...open, add:false});
                }
                else{
                    Toast(res.message);
                }
            }
            catch(E){
                alert(E.toString()+response)
            }
        })
    }

    useEffect(()=>{
        getRows();
    }, []);

    return (
        <>
            <Box sx={{p:2}}>
                <Button variant="contained" sx={{textTransform:"none"}} onClick={e=>setOpen({...open, add:true})}>Add Subject</Button>
            </Box>
            <Box sx={{m:2,width:350}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row,index)=>(
                            <TableRow hover key={row.id} sx={{background:(index % 2 == 0 ? "rgba(0, 0, 0, 0.04)":"#fff")}}>
                                <TableCell padding="none" sx={{pl:2}}>{index+1}</TableCell>
                                <TableCell padding="none">{row.name}</TableCell>
                                <TableCell sx={{padding:"7px"}}>
                                    <Link href="#">Edit</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            <Dialog open={open.add} onClose={()=>setOpen({...open, add:false})}>
                <div className="w3-padding-large" style={{width:"340px"}}>
                    <CloseHeading label="Add New Subject" onClose={()=>setOpen({...open, add:false})}/>
                    <form onSubmit={save}>
                        <TextField label="Subject Name" fullWidth size="small" name="new_subject" sx={{mt:2,mb:3}} />
                        
                        <Button variant="contained" type="submit">Submit</Button>
                    </form>
                    <BottomClose onClose={()=>setOpen({...open, add:false})}/>
                </div>
            </Dialog>
        </>
    )
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

/*
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
*/