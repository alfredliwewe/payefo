const {TextField,Button,Alert,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper,Table,
    TableHead,Fab,Radio,Divider,Typography, createTheme, ThemeProvider,
    TableRow,Tabs, Tab,Box,Chip,
    TableCell,TablePagination,Drawer,Link,MenuItem,Dialog,Input,
    TableBody
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
                    borderRadius:"16px"
                }
            }
        },
    }
});

var format = new Intl.NumberFormat();

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
    const [open,setOpen] = useState(false);
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

    return (
        <>
            <Context.Provider value={{page,setPage,hasSubscribed,setHasSubscribed,activeBook,setActiveBook}}>
                <div className="">
                    <div className="bg-primary w3-padding w3-text-white">
                        <Fab size="small" onClick={e=>setOpen(true)} style={{background:"transparent",boxShadow:"none"}}>
                            <i className="fa fa-bars w3-large w3-text-white"/>
                        </Fab>
                        <span className="pl-5">
                            <span className="pt-1">
                                Payefo
                            </span>
                        </span>
                    </div>
                    <div className="" style={{height:window.innerHeight+"px",overflow:"auto"}}>
                        {page == "Home" ? <Home />:
                        page == "Resources" ? <Resources />:
                        page == "View" ? <View />:
                        page == "Users" ? <Users />:
                        page == "Adverts" ? <Adverts />:
                        page == "Genres" ? <Genres />:
                        page == "System Values" ? <SystemValues />:
                        page == "Music" ? <Music />:
                        <>{page}</>}
                    </div>
                </div>

                <Drawer open={open} onClose={()=>setOpen(false)} anchor="left">
                    <div className="w3-padding w3-border-right w3-light-grey" style={{overflow:"auto",width:(0.7 * window.innerWidth)+"px",height:window.innerHeight+"px"}}>
                        <div className="w3-center pt-20 pb-20">
                            <img src={"../images/logo.png"} width="40" />
                        </div>
                        {menus.map((row,index)=>(
                            <ListItem size="small" key={row.title} onClick={e=>{
                                setPage(row.title);
                                setOpen(false)
                            }} className={row.title == page ? "activeButton":""} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <i className={row.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={row.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem size="small" onClick={e=>{
                            window.location = '../'
                        }} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <i className={"fa fa-power-off"} />
                                </ListItemIcon>
                                <ListItemText primary={"Logout"} />
                            </ListItemButton>
                        </ListItem>
                    </div>
                </Drawer>
            </Context.Provider>
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
        {
            id:1,
            title:"VISA",
            icon:"fab fa-cc-visa",
            description:"You will subscribe for 3 months"
        },
        {
            id:2,
            title:"Paypal",
            icon:"fab fa-cc-paypal",
            description:"You will subscribe for 3 months"
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
                        <Paper className="p-3">
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

                    <div class="mt-2 mb-2">
                        {packages.map((row,index)=>(
                            <div class="mt-3">
                                <div className="ms-shadow p-2 rounded w3-center pointer hover:bg-blue-100" onClick={e=>{
                                    setActive(row);
                                    setOpen({...open, pricing:false, method:true});
                                }}>
                                    <div className={`bg-${colors[index]}-200 rounded-xl p-2`}>
                                        <font className={`block text-${colors[index]}-800 text-bold font-bold text-uppercase text-lg`}>{row.name}</font>
                                        <font className="block text-sm my-2" style={{lineHeight: 1.5, maxHeight: "calc(2 * 1.5em)", overflow: "hidden"}}>{row.description}</font>
                                    </div>
                                    <div className="text-center py-2 pt-3">
                                        <font className="font-bold text-xl block">K{format.format(row.price)}/mo</font>
                                        <font className="w3-small w3-opacity">{row.businesses} businesses</font>
                                    </div>
                                    
                                    <div className="w3-center py-2">
                                        {row.duration} months
                                    </div>
                                    
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
                <div className="p-3" style={{maxWidth:"450px"}}>
                    <CloseHeading label="Payment Method" onClose={()=>setOpen({...open, method:false})}/>
                    <div className="my-3">
                        {methods.map((row,index)=>(
                            <div className={"border rounded-xl p-2 mb-2 hover:bg-gray-100 pointer "+(row.id == method ? "border-primary text-primary":"")} onClick={e=>setMethod(row.id)}>
                                <div className="w3-row">
                                    <div className="w3-col s2 w3-center">
                                        <i className={row.icon+" w3-xlarge"} />
                                    </div>
                                    <div className="w3-col s9">
                                        <font className="block">{row.title}</font>
                                        <font className="block w3-small">{row.description}</font>
                                    </div>
                                    <div className="w3-col s1">
                                        <Radio checked={row.id == method} />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {method != 0 && <Button variant="outlined" onClick={e=>{
                            if(method != 3){
                                Toast("Not implemented yet");
                            }
                            else{
                                setOpen({...open, method:false, confirm:true});
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

function TabPanel(props){
    const {children, value,index, ...other} = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    )
}

function a11yProps(index){
    return {
        id:'simple-tab-'+index,
        'aria-controls':`simple-tabpanel-${index}`
    }
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
                <div className="w3-responsive">
                    <div className="py-2 flex gap-1">
                        {subjects.map((row,index)=>(
                            <Chip label={row.name} variant={row.id != subject ? "outlined":"contained"} onClick={e=>setSubject(row.id)} color="primary" sx={{ml:1}} />
                        ))}
                    </div>
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