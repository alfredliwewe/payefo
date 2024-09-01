const {TextField,Button,Alert,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper,Table,
    TableHead,ThemeProvider,createTheme,Radio,Divider,
    TableRow,Tabs, Tab,Box,Chip,Typography, FormLabel,Rating,DialogTitle,DialogActions,DialogContent,DialogContentText,
    TableCell,TablePagination,Drawer,Link,MenuItem,Dialog,Input,
    TableBody,Fab
} = MaterialUI;
const {useState,useEffect,useContext,createContext} = React;

const Context = createContext({});

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
                    page == "Programmes" ? <Programmes />:
                    page == "Staff" ? <Staff />:
                    page == "Languages" ? <Languages />:
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