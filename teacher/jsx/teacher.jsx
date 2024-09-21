const {TextField,Button,Alert,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper,Table,
    TableHead,ThemeProvider,createTheme,Radio,Divider,
    TableRow,Tabs, Tab,Box,Chip,Typography, FormLabel,Rating,DialogTitle,DialogActions,DialogContent,DialogContentText,
    TableCell,TablePagination,Drawer,Link,MenuItem,Dialog,Input,
    TableBody,Fab, Card,IconButton,InputBase,
    CardHeader,Avatar,Menu,
    CardContent
} = MaterialUI;
const {useState,useEffect,useContext,createContext} = React;

const Context = createContext({});

const { red } = MaterialUI.colors;

//make the todays date
const now = moment();
const today = now.format('YYYY-MM-DD');
const first_day = now.format('YYYY-MM-')+"01";

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
                    page == "Lessons" ? <Lessons />:
                    page == "Lesson" ? <Lesson />:
                    page == "Profile" ? <Profile />:
                    page == "System Values" ? <Settings />:
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
    return (
        <>
        </>
    )
}

function Profile(props){
    const [value, setValue] = React.useState(0);
    const [modals, setModals] = useState({
        editEmail:false,
        editName:false
    });
    const [user, setUser] = useState({id:0,name:"",picture:"default_avatar.png"});
  
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
                        setUser({...user, picture:res.filename});
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
                        <img src={"../uploads/"+user.picture} width="100%" />
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

function Resources(){
    const [subjects,setSubjects] = useState([]);
    const [books,setBooks] = useState([]);
    const [rows,setRows] = useState([]);
    const [subject,setSubject] = useState(0);
    const {page,setPage,user,setUser,activeBook,setActiveBook,hasSubscribed} = useContext(Context);
    const [form,setForm] = useState({
        form:0,
        subject:0
    });
    const [open,setOpen] = useState({
        add:false,
        edit:false,
        delete:false
    });
    const [active,setActive] = useState({});

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

    const saveWord = (event) => {
        event.preventDefault();

        post("api/", new FormData(event.target), response=>{
            try{
                let res = JSON.parse(response);

                if(res.status){
                    Toast("Success");
                    getBooks();
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

        post("api/", new FormData(event.target), response=>{
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

    useEffect(()=>{
        getSubjects();
        getBooks();
    }, []);

    return (
        <>
            <div className="p-3">
                <form onSubmit={filterRecords} className="py-2">
                    <TextField 
                        label="Subject" 
                        sx={{width:180}} 
                        size="small" 
                        select 
                        value={form.subject}
                        onChange={e=>setForm({...form, subject:e.target.value})}
                        name="subject_resources">
                        {subjects.map((row,index)=>(
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

                <Button sx={{my:2}} onClick={e=>setOpen({...open, add:true})}><i className="fa fa-arrow-up mr-2"/> Upload</Button>

                <Box>
                    <Input type="search" placeholder="Search"/>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Admin</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row,index)=>(
                                <TableRow hover sx={{background:(index % 2 == 0 ? "rgba(0, 0, 0, 0.04)":"#fff")}} key={row.id}>
                                    <TableCell padding="none" sx={{pl:2}}>{index+1}</TableCell>
                                    <TableCell padding="none">{row.author}</TableCell>
                                    <TableCell padding="none">{row.title}</TableCell>
                                    <TableCell padding="none">{row.image}</TableCell>
                                    <TableCell padding="none">{row.date}</TableCell>
                                    <TableCell padding="none">{row.type}</TableCell>
                                    <TableCell padding="none">{row.admin_data.name}</TableCell>
                                    <TableCell sx={{p:1}}>
                                        <Link href="#" onClick={e=>{
                                            setActive(row);
                                            setOpen({...open, edit:true});
                                        }}>Edit</Link>
                                        <Link href="#" sx={{ml:2}} onClick={e=>{
                                            setActive(row);
                                            setOpen({...open, delete:true});
                                        }} color="error">Delete</Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </div>

            <Dialog open={open.add} onClose={()=>setOpen({...open, add:false})}>
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <CloseHeading label="Add book/resource" onClose={()=>setOpen({...open, add:false})}/>
                    <form onSubmit={saveWord}>
                        <TextField label={"Subject"} fullWidth size="small" name={"subject"} sx={{mt:2}} select>
                            {subjects.map((row,index)=>(
                                <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField label={"Resource type"} fullWidth size="small" name={"type"} defaultValue={"notes"} sx={{mt:2}} select>
                            {["notes","past paper"].map((row,index)=>(
                                <MenuItem value={row} key={row}>{Strings.uc_words(row)}</MenuItem>
                            ))}
                        </TextField>

                        <TextField label={"Form"} fullWidth size="small" name={"form"} defaultValue={"notes"} sx={{mt:2}} select>
                            {[1,2,3,4].map((row,index)=>(
                                <MenuItem value={row} key={row}>{row}</MenuItem>
                            ))}
                        </TextField>

                        <TextField label={"Title"} fullWidth size="small" name={"new_book_title"} sx={{mt:2}} />
                        <TextField label={"Author"} fullWidth size="small" name={"author"} sx={{mt:2}} />
                        <TextField label={"Document File"} type="file" fullWidth size="small" name={"file"} sx={{mt:2}} />
                        
                        <Button variant="contained" sx={{mt:3}} type="submit">Submit</Button>
                    </form>
                    <BottomClose onClose={()=>setOpen({...open, add:false})}/>
                </div>
            </Dialog>

            <Drawer anchor="right" open={open.edit} onClose={()=>setOpen({...open, edit:false})}>
                <div className="w3-padding-large" style={{width:"340px"}}>
                    <CloseHeading label="Edit resource" onClose={()=>setOpen({...open, edit:false})}/>
                    <form onSubmit={edit}>
                        <input type="hidden" name="resource_id" value={active.id} />

                        <TextField 
                            label={"Subject"} 
                            fullWidth 
                            size="small" 
                            name={"subject"} 
                            sx={{mt:2}} 
                            value={active.subject}
                            onChange={e=>setActive({...active, subject:e.target.value})}
                            select>
                            {subjects.map((row,index)=>(
                                <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField 
                            label={"Resource type"} 
                            fullWidth 
                            size="small" 
                            name={"type"} 
                            defaultValue={"notes"} 
                            sx={{mt:2}} 
                            value={active.type}
                            onChange={e=>setActive({...active, type:e.target.value})}
                            select>
                            {["notes","past paper"].map((row,index)=>(
                                <MenuItem value={row} key={row}>{Strings.uc_words(row)}</MenuItem>
                            ))}
                        </TextField>

                        <TextField 
                            label={"Title"} 
                            fullWidth 
                            size="small" 
                            name={"edit_book_title"} 
                            sx={{mt:2}}
                            value={active.title}
                            onChange={e=>setActive({...active, title:e.target.value})} />
                        <TextField 
                            label={"Author"} 
                            fullWidth 
                            size="small" 
                            name={"author"} 
                            value={active.author}
                            onChange={e=>setActive({...active, author:e.target.value})}
                            sx={{mt:2,mb:3}} />
                        
                        <Button variant="contained" sx={{mt:3}} type="submit">Submit</Button>
                    </form>
                    <BottomClose onClose={()=>setOpen({...open, add:false})}/>
                </div>
            </Drawer>

            {open.delete && <Warning
                title={`Delete Resource`}
                secondaryText={`Are you sure you want to delete ${active.title}?`}
                action={{
                    text:"Confirm",
                    callback:()=>{
                        $.post("api/", {deleteResource:"true",id:active.id}, response=>{
                            try{
                                let res = JSON.parse(response);
                                if(res.status){
                                    setOpen({...open, delete:false});
                                    getRows();
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
                onClose={()=>setOpen({...open, delete:false})}
            />}
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

function Lessons(){
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{minHeight:"unset"}}>
                        <Tab label="Create" {...a11yProps(0)} sx={{minHeight:"unset"}}/>
                        <Tab label="Available"{...a11yProps(1)} sx={{minHeight:"unset"}} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <CreateLesson onSuccess={()=>setValue(1)} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <AvailableLessons />
                </TabPanel>
            </Box>
        </>
    )
}

function CreateLesson(props){
    const [subjects,setSubjects] = useState([]);
    const [attachments,setAttachments] = useState([]);
    const [files,setFiles] = useState([]);

    const saveLesson = (event) => {
        event.preventDefault();

        let formdata = new FormData(event.target);

        files.map((row,index)=>{
            formdata.append("attachment"+(index), files[index]);
        })
        formdata.append("attachments", files.length);

        post("api/", formdata, response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success")
                    props.onSuccess();
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const fileExtension = (filename) => {
        let chars = filename.split(".")
        return chars[chars.length-1].toLowerCase();;
    }

    const fileType = (filename) => {
        let ext = fileExtension(filename);

        if(["png","jpg","jpeg","webp","gif","tiff"].includes(ext)){
            return "img";
        }
        else{
            return ext;
        }
    }

    const chooseFiles = () => {
        let input = document.createElement("input");
        input.type = 'file';
        input.multiple = 'multiple'
        input.addEventListener('change', function(e){
            let files = [], pure_files = [];
            for (let i = 0; i<input.files.length; i++){
                let file = input.files[i];
                pure_files.push(file);

                file.src = URL.createObjectURL(file);
                file.typeFile = fileType(file.name)
                files.push(file)
            }

            setAttachments(files);
            setFiles(pure_files);
        });

        input.click();
    }

    const getSubjects = () => {
        $.get("api/", {getSubjects:"true"}, res=>setSubjects(res));
    }

    useEffect(()=>{
        getSubjects()
    }, []);

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m3">&nbsp;</div>
                <div className="w3-col m6">
                    <h2>Create a Lesson</h2>

                    <form onSubmit={saveLesson}>
                        <TextField label="Subject" size="small" fullWidth  name={"subject"} sx={{mt:2}} select>
                            {subjects.map((row,index)=>(
                                <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField label={"Form"} fullWidth size="small" name={"form"} defaultValue={"notes"} sx={{mt:2}} select>
                            {[1,2,3,4].map((row,index)=>(
                                <MenuItem value={row} key={row}>{row}</MenuItem>
                            ))}
                        </TextField>

                        <TextField label={"Title"} fullWidth size="small" name={"new_lesson_title"} sx={{mt:2}} />
                        <TextField label={"Description"} fullWidth size="small" name={"description"} sx={{my:2}} multiline rows={4} />

                        <Button variant="outlined" onClick={chooseFiles}><i className="fa fa-paperclip mr-2"/> Attach files</Button>
                        <Box sx={{my:2}}>
                            {attachments.map((row,index)=>(
                                <>{row.typeFile == "img" ? <>
                                    <img src={row.src} width={"100%"} className="rounded"/>
                                </>:
                                <>
                                    <video width={"100%"} controls>
                                        <source src={row.src} type="video/mp4"/>
                                    </video>
                                </>}</>
                            ))}
                        </Box>
                        <Button variant="contained" type="submit">Submit Lesson</Button>
                    </form>
                </div>
            </div>
        </>
    )
}

function AvailableLessons(){
    const [subjects,setSubjects] = useState([]);
    const [books,setBooks] = useState([]);
    const [rows,setRows] = useState([]);

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
                    <form onSubmit={filterRecords} className="py-2" id="filterRecords">
                        <TextField 
                            label="Subject" 
                            sx={{width:180}} 
                            size="small" 
                            select 
                            value={form.subject}
                            onChange={e=>setForm({...form, subject:e.target.value})}
                            name="subject_lessons">
                            {subjects.map((row,index)=>(
                                <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField 
                            label="Form" 
                            sx={{width:120,ml:2}} 
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
                            label="Create date from" 
                            sx={{width:160,ml:2}} 
                            size="small" 
                            type="date" 
                            defaultValue={first_day}
                            name="start_date"/>

                        <TextField 
                            label="End date" 
                            sx={{width:160,mx:2}} 
                            size="small" 
                            type="date" 
                            defaultValue={today}
                            name="end_date"/>

                        <Button variant="outlined" type="submit">Submit</Button>
                    </form>

                    <Divider/>

                    {rows.map((row,index)=>(
                        <LessonView data={row} key={row.id} onRefresh={()=>{
                            filterRecords({
                                preventDefault:()=>{},
                                target:document.getElementById("filterRecords")
                            });
                        }}/>
                    ))}

                    {rows.length == 0 && <Alert severity="error">No lessons available for this selection</Alert>}
                </div>
            </div>
        </>
    )
}

function LessonView(props){
    const [data,setData] = useState(props.data);
    const {page,setPage} = useContext(Context);
    const [open,setOpen] = useState({
        edit:false,
        delete:false,
        dates:false
    });

    useEffect(()=>{
        setData(props.data);
    }, [props.data]);

    const listenMenu = (type) => {
        switch(type){
            case "delete":
                setOpen({...open, delete:true});
                break;

            case "dates":
                setOpen({...open, dates:true});
                break;
        }
    }

    const saveDates = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast(res.message)
                    setOpen({...open, dates:false});
                    props.onRefresh();
                }
                else{
                    Toast(res.message)
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return (
        <>
            <div className="p-2 mt-3">
                <Card sx={{ width: '100%',borderRadius:"24px" }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">R</Avatar>
                        }
                        action={
                            <BasicMenu onMenuClick={listenMenu} />
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

            {open.delete && <Warning
                title="Delete lesson"
                secondaryText={"Are you sure you want to delete this lesson ?"}
                action={{
                    text:"Confirm",
                    callback:()=>{
                        $.post("api/", {deleteLesson:"true",id:data.id}, response=>{
                            try{
                                let res = JSON.parse(response);
                                if(res.status){
                                    setOpen({...open, delete:false});
                                    props.onRefresh();
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
                onClose={()=>setOpen({...open, delete:false})}
            />}

            <Dialog open={open.dates} onClose={()=>setOpen({...open, dates:false})}>
                <div className="p-3" style={{width:"400px"}}>
                    <CloseHeading label="Change dates" onClose={()=>setOpen({...open, dates:false})}/>
                    <form onSubmit={saveDates} >
                        <input type="hidden" name="lesson_id" value={data.id} />

                        <TextField 
                            label="Start date" 
                            type="date"
                            value={data.start_active_day}
                            onChange={e=>setData({...data, start_active_day:e.target.value})}
                            name="start_date"
                            size="small"
                            sx={{mt:2}}
                            fullWidth />

                        <TextField 
                            label="Start date" 
                            type="date"
                            value={data.end_active_day}
                            onChange={e=>setData({...data, end_active_day:e.target.value})}
                            size="small"
                            name="end_date"
                            sx={{mt:2,mb:3}}
                            fullWidth />

                        <Button type="submit">Save Changes</Button>
                    </form>

                    <BottomClose onClose={()=>setOpen({...open, dates:false})}/>
                </div>
            </Dialog>
        </>
    )
}

function BasicMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (type) => {
        setAnchorEl(null);
        props.onMenuClick(type);
    };
  
    return (
        <div>
            <Fab size="small" sx={{boxShadow:"none"}}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                >
                <i className="fa fa-ellipsis text-lg"/>
            </Fab>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
                >
                <MenuItem onClick={()=>handleClose("edit")}>Edit lesson</MenuItem>
                <MenuItem onClick={()=>handleClose("dates")}>Change active dates</MenuItem>
                <MenuItem onClick={()=>handleClose("delete")} color="error">Delete</MenuItem>
            </Menu>
        </div>
    );
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

    useEffect(()=>{
        getReplies();
    }, []);

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
                        <a class="hide">Likes</a>
                        <a>
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