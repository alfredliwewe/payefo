const {TextField,Button,Alert,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper,Table,
    TableHead,Fab,
    TableRow,Tabs, Tab,Box,Chip,
    TableCell,TablePagination,Drawer,Link,MenuItem,Dialog,Input,
    TableBody
} = MaterialUI;
const {useState,useEffect,useContext,createContext} = React;

const Context = createContext({});

window.onload = function(){
    ReactDOM.render(<Index />, document.getElementById("root"));
}

function Index(){
    const [page,setPage]= useState("Home"); //Home
    const [open,setOpen] = useState(false);
    
    const menus = [
        {
            title:"Home",
            icon:"fa fa-home"
        },
        {
            title:"Genres",
            icon:"fa fa-music"
        },
        {
            title:"Artists",
            icon:"fa fa-user-friends"
        },
        {
            title:"Music",
            icon:"fa fa-music"
        },
        {
            title:"Charts",
            icon:"fa fa-list-ol"
        },
        {
            title:"Users",
            icon:"fa fa-users"
        },
        {
            title:"Adverts",
            icon:"fa fa-bullhorn"
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

    return (
        <>
            <div className="">
                <div className="bg-primary w3-padding-large w3-text-white">
                    <Fab size="small" onClick={e=>setOpen(true)} style={{background:"transparent",boxShadow:"none"}}>
                        <i className="fa fa-bars w3-large w3-text-white"/>
                    </Fab>
                </div>
                <div className="" style={{height:window.innerHeight+"px",overflow:"auto"}}>
                    {page == "Home" ? <Home />:
                    page == "Artists" ? <ArtistsView />:
                    page == "Charts" ? <Charts />:
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
        </>
    )
}

function Home(){
    const [data,setData] = useState({
        users:0,
        songs:0,
        charts:0,
        artists:0,
        genres:0
    });

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
            <div className="w3-row">
                <div className="w3-col m2 s6">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>All User</font>
                            <font className="w3-large block">{data.users}</font>
                        </div>
                    </div>
                </div>

                <div className="w3-col m2 s6">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>Songs</font>
                            <font className="w3-large block">{numberFormat(data.songs)}</font>
                        </div>
                    </div>
                </div>

                <div className="w3-col m2 s6">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>Genres</font>
                            <font className="w3-large block">{data.genres}</font>
                        </div>
                    </div>
                </div>

                <div className="w3-col m2 s6">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>Charts</font>
                            <font className="w3-large block">{data.charts}</font>
                        </div>
                    </div>
                </div>

                <div className="w3-col m2 s6">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>Artists</font>
                            <font className="w3-large block">{numberFormat(data.artists)}</font>
                        </div>
                    </div>
                </div>

                <div className="w3-col m2 s6">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>All User</font>
                            <font className="w3-large block">20</font>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </>
    )
}

function ArtistsView(){
    const [value,setValue] = useState(0);
    
    const handleChange = (event,newValue) => {
        setValue(newValue);
    }

    return (
        <>
            <div className="">
                <Box>
                    <Box sx={{borderBottom:1,borderColor:'divider'}}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Artists" sx={{textTransform:"none"}} {...a11yProps(0)} />
                            <Tab label="Categories" sx={{textTransform:"none"}} {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Artists />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <h1>Categories</h1>
                    </TabPanel>
                </Box>
            </div>
        </>
    )
}

function Artists(){
    const [rows,setRows] = useState([]);
    const [countries,setCountries] = useState([]);
    const [page,setPage] = useState(0);
    const [count,setCount] = useState(0);
    const [country,setCountry] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [open,setOpen] = useState({
        add:false,
        manage:false
    });
    const [active,setActive]= useState({
        photo:""
    });
    const anchor = "manage";
    const [stage,setStage] = useState("table");
    const [search,setSearch] = useState("");
    const [results,setResults]= useState([]);
    const [songs, setSongs]= useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getArtists();
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getArtists();
    };

    const getArtists = () => {
        $.get("api/", {getArtists:"true",start:(page*rowsPerPage),limit:rowsPerPage, country:country}, function(response){
            setRows(response);
        });
    }

    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, function(response){
            setCountries(response);
        })
    }

    const getCount = () => {
        $.get("api/", {countArtists:"true"}, function(response){
            setCount(response.count);
        })
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen({ ...state, [anchor]: open });
    };

    useEffect(()=>{
        getArtists();
        getCountries();
        getCount();
    }, []);

    const saveChanges = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setOpen({...open, manage:false});
                    getArtists();
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
        if(search.length > 0){
            $.get("api/", {searchArtist:search}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [search]);

    const saveArtist = (event) => {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response) {
            try{
                let res = JSON.parse(response);
                if(res.status){
                    form.reset();
                    Toast("Success");
                    getArtists();
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

    useEffect(()=>{
        if(active.id != undefined){
            $.get("api/", {getArtistSongs:active.id}, function(response){
                setSongs();
            })
        }
    }, [active]);

    useEffect(()=>{
        getArtists();
    }, [country,rowsPerPage]);

    const artistPhoto = (url) => {
        if(url.indexOf("http://") != -1 || url.indexOf("https://") != -1){
            return url;
        }
        else{
            return "../uploads/artists/"+url;
        }
    }

    const changePhoto = (event) => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*"

        input.addEventListener('change', function(event) {
            let formdata = new FormData();
            formdata.append("change_artist_picture", input.files[0]);
            formdata.append("artist_id", active.id);

            post("api/", formdata, function(response){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast("Success");
                        setActive({...active, photo:res.photo})
                    }
                    else{
                        Toast(res.message)
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        });

        input.click();
    }

    return (
        <Context.Provider value={{songs,setSongs,active,setActive}}>
            {stage == "table" ? 
            <div className="">
                <Button variant="contained" onClick={()=>setOpen({...open, add:true})} sx={{m:2}}>Add Artist</Button>

                <Paper sx={{mt:2}} className="w3-responsive">
                    <div >
                        <Input placeholder="Search Artist" value={search} onChange={e=>setSearch(e.target.value)} sx={{width:"200px"}} />
                        <select value={country} onChange={e=>setCountry(e.target.value)}>
                            <option value={0}>--Country--</option>
                            {countries.map((row,index)=>(
                                <option value={row.id}>{row.name}</option>
                            ))}
                        </select>
                    </div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>WebId</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Biography</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Picture</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.length > 0 ? <>
                                {results.map((row,index) => (
                                    <TableRow hover key={row.id}>
                                        <TableCell padding="none" align="center">{rowsPerPage*page + (index+1)}</TableCell>
                                        <TableCell padding="none">{row.webid}</TableCell>
                                        <TableCell padding="none">{row.name}</TableCell>
                                        <TableCell padding="none">{row.biography.length > 50 ? row.biography.substring(0,50)+"..." : row.biography}</TableCell>
                                        <TableCell padding="none">{row.country_data.name}</TableCell>
                                        <TableCell padding="none">{row.status}</TableCell>
                                        <TableCell padding="none">
                                            <Link href="#">View</Link>
                                        </TableCell>
                                        <TableCell sx={{padding:"5px"}}>
                                            <Button variant="contained" size="small" onClick={e=>{
                                                setActive(row);
                                                setOpen({...open, manage:true});
                                            }}>Manage</Button>

                                            <Button variant="contained" size="small" onClick={e=>{
                                                setActive(row);
                                                setStage("details");
                                            }}>Songs</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>:
                            <>
                            {rows.map((row,index) => (
                                <TableRow hover key={row.id}>
                                    <TableCell padding="none" align="center">{rowsPerPage*page + (index+1)}</TableCell>
                                    <TableCell padding="none">{row.webid}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.biography.length > 50 ? row.biography.substring(0,50)+"..." : row.biography}</TableCell>
                                    <TableCell padding="none">{row.country_data.name}</TableCell>
                                    <TableCell padding="none">{row.status}</TableCell>
                                    <TableCell padding="none">
                                        <Link href="#">View</Link>
                                    </TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" onClick={e=>{
                                            setActive(row);
                                            setOpen({...open, manage:true});
                                        }}>Details</Button>

                                        <Button variant="contained" size="small" onClick={e=>{
                                            setActive(row);
                                            setStage("details");
                                        }}>Songs</Button>
                                    </TableCell>
                                </TableRow>
                            ))}</>}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={Number(count)}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>:
            stage == "details" ?<>
                <div className="w3-padding" onClick={e=>{
                    setStage("table")
                }}>
                    <i className="fa fa-arrow-left" /> Go Back
                </div>
                <div className="w3-padding">
                    <ArtistDetails />
                </div>
            </>:
            <>{stage}</>}

            <Drawer
                anchor="right"
                open={open.manage}
                onClose={()=>setOpen({...open, manage:false})}
                >
                <div style={{width:(.85*window.innerWidth)+"px"}} className="w3-padding-large">
                    <font>Manage {active.name}</font>

                    <div className="pt-15 pb-15 w3-center">
                        <img src={artistPhoto(active.photo)} width="50%" className="rounded" />
                        <br />
                        <br />
                        <Button variant="outlined" size="small" onClick={changePhoto} sx={{textTransform:"none"}}>Change</Button> 
                        <Button variant="outlined" size="small" startIcon={<i className="fa fa-globe w3-small"/>} onClick={changePhoto} sx={{textTransform:"none",ml:1}}>Web</Button>
                    </div>

                    <form onSubmit={saveChanges}>
                        <input type="hidden" name="artist_id" value={active.id} />
                        <TextField label="Name" size="small" name="artist_name_edit" fullWidth value={active.name} onChange={e=>setActive({...active, name:e.target.value})} sx={{mt:2}} />
                        <TextField label="WebId" size="small" name="webid" fullWidth value={active.webid} onChange={e=>setActive({...active, webid:e.target.value})} sx={{mt:2}} />
                        <TextField select label="Country" size="small" sx={{mt:2}} hiddenLabel name="country" value={active.country} onChange={e=>setActive({...active, country:e.target.value})} fullWidth>
                            {countries.map((row,index) => (
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Biography" size="small" multiline rows={3} name="biography" fullWidth value={active.biography} onChange={e=>setActive({...active, biography:e.target.value})} sx={{mt:2,mb:3}} />
                        
                        <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Changes</Button>
                    </form>
                    <hr />
                    <div className="pt-15">
                        <Button variant="contained" color="error">Delete</Button>
                    </div>
                </div>
            </Drawer>

            <Dialog
                open={open.add}
                onClose={()=>setOpen({...open, add:false})}
                >
                <div className="w3-padding-large" style={{}}>
                    <font className="w3-large">Add Artist</font>

                    <form onSubmit={saveArtist}>
                        <TextField label="Artist Name" fullWidth name="artist_name" sx={{mt:2}}/>
                        <TextField label="Biography" multiline rows={3} fullWidth name="biography" sx={{mt:2}}/>
                        <TextField select label="Country" size="small" sx={{mt:2}} hiddenLabel name="country" fullWidth>
                            <MenuItem value={"0"}>
                                None
                            </MenuItem>
                            {countries.map((row,index) => (
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Photo" fullWidth name="photo" required type="file" sx={{mt:2,mb:3}}/>
                        <Button variant="contained" type="submit">Save Artist</Button>
                    </form>

                    <div className="pt-15 pb-15 clearfix">
                        <Button variant="contained" className="float-right" color="error" onClick={()=>setOpen({...open, add:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </Context.Provider>
    )
}

function Charts(){
    const [charts,setCharts]= useState([]);
    const [page,setPage] = useState(0);
    const [stage,setStage]= useState("table")
    const [count,setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [open,setOpen] = useState({
        add:false,
        manage:false
    });
    const [active,setActive]= useState({});
    const anchor = "manage";
    const [countries,setCountries] = useState([]);
    const [songs,setSongs] = useState([]);
    
    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, function(response){
            setCountries(response);
        })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getCharts = () => {
        $.get("api/", {getCharts:"true"}, function(res){
            setCharts(res);
        })
    }

    useEffect(()=>{
        getCharts();
        getCountries();
    }, []);

    const addChart = (event)=> {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setOpen({...open, add:false});
                    getCharts();
                    Toast("Success");
                    form.reset();
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
        if(active.id != undefined){
            $.get("api/", {getChartSongs:active.id}, function(response){
                setSongs(response);
            })
        }
    }, [active]);

    return (
        <Context.Provider value={{active,setActive,countries,setCountries,songs,setSongs}}>
            {stage == "table" ?
                <div className="w3-padding">
                    <Button variant="contained" onClick={e=>setOpen({...open, add:true})}>Add Chart</Button>

                    <Paper sx={{mt:2}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Songs</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Picture</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {charts.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index) => (
                                <TableRow key={row.id} hover>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.description}</TableCell>
                                    <TableCell padding="none">{row.songs}</TableCell>
                                    <TableCell padding="none">{row.status}</TableCell>
                                    <TableCell padding="none">
                                        <img src={"../uploads/"+row.picture} width="30" />
                                    </TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" onClick={e=>{
                                            setActive(row);
                                            //setOpen({...open, manage:true});
                                            setStage("details");
                                        }}>Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                            component="div"
                            count={charts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                    </Paper>
                </div>:
            stage == "details" ? <>
                <div className="w3-padding" onClick={e=>{
                    setStage("table");
                    getCharts();
                }}>
                    <i className="fa fa-arrow-left"></i> Go back
                </div>
                <div className="w3-padding">
                    <ChartDetails />
                </div>
            </>:
            <>{stage}</>}

            <Dialog
                anchor="right"
                open={open.add}
                onClose={()=>setOpen({...open, add:false})}
                >
                <div style={{}} className="w3-padding-large">
                    <font>Add Music Chart</font>

                    <form onSubmit={addChart}>
                        <TextField label="Name" size="small" name="chart_name" fullWidth sx={{mt:2}} />
                        <TextField label="Picture" type="file" size="small" name="picture" fullWidth sx={{mt:2}} />
                        <TextField select label="Country" size="small" sx={{mt:2}} hiddenLabel name="country" fullWidth>
                            <MenuItem value={"0"}>
                                International
                            </MenuItem>
                            {countries.map((row,index) => (
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Description" size="small" multiline rows={3} name="biography" fullWidth sx={{mt:2,mb:3}} />
                        
                        <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Changes</Button>
                    </form>
                    <hr />
                    <div className="pt-15 clearfix">
                        <Button variant="contained" color="error" className="float-right" onClick={()=>setOpen({...open, add:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </Context.Provider>
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

function ChartDetails(){
    const [value,setValue] = useState(0);
    const [search,setSearch] = useState("");
    const [results,setResults] = useState([]);

    const handleChange = (event,newValue) => {
        setValue(newValue);
    }

    const {active,setActive,countries,setCountries,songs,setSongs} = useContext(Context);

    const updateChart = (event) => {
        event.preventDefault();
    }

    const changePicture= () => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.addEventListener("change", function(event){
            let formdata = new FormData();
            formdata.append("change_chart_picture", input.files[0]);
            formdata.append("chart_id", active.id);

            post("api/", formdata, function(response){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        setActive({...active, picture:res.picture});
                    }
                    else{
                        Toast(res.message);
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            });
        })

        input.click();
    }

    useEffect(()=>{
        if(search.length > 0){
            //
            $.get("api/", {searchSong:search}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [search]);


    const saveToChart = (id) => {
        $.post("api/", {saveToChart:id,chart:active.id}, function(response){
            Toast(response);
            $.get("api/", {getChartSongs:active.id}, function(response){
                setSongs(response);
            })
        })
    }

    return(
        <>
            <Box>
                <Box sx={{borderBottom:1,borderColor:'divider'}}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Details" sx={{textTransform:"none"}} {...a11yProps(0)} />
                        <Tab label="Songs" sx={{textTransform:"none"}} {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <h1>Details</h1>
                    <div className="w3-row">
                        <div className="w3-col m5">
                            <div className="pt-20 pb-20 w3-center">
                                <img src={"../uploads/"+active.picture} width="50%" className="w3-round-large" />

                                <br />
                                <br />
                                <Button variant="outlined" onClick={changePicture} size="small">Change Picture</Button>
                            </div>
                        </div>
                        <div className="w3-col m1">&nbsp;</div>
                        <div className="w3-col m5">
                            <h5>Update chart details</h5>
                            <form onSubmit={updateChart}>
                                <input type="hidden" name="chart_it" value={active.id} />
                                <TextField label="Name" size="small" name="chart_name" value={active.name} onChange={e=>setActive({...active, name:e.target.value})} fullWidth sx={{mt:2}} />
                                <TextField select label="Country" size="small" sx={{mt:2}} hiddenLabel value={active.country} onChange={e=>setActive({...active, country:e.target.value})} name="country" fullWidth>
                                    <MenuItem value={"0"}>
                                        International
                                    </MenuItem>
                                    {countries.map((row,index) => (
                                        <MenuItem key={row.id} value={row.id}>
                                            {row.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField label="Description" size="small" multiline rows={3} name="biography" value={active.description} onChange={e=>setActive({...active, description:e.target.value})} fullWidth sx={{mt:2,mb:3}} />
                                
                                <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Changes</Button>
                            </form>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <h1>Songs</h1>
                    <div className="w3-row">
                        <div className="w3-col m5">
                            <TextField label="Search song" value={search} onChange={e=>setSearch(e.target.value)} variant="standard" fullWidth/>
                            {results.length > 0 ? <>
                                {results.map((row,inde) => (
                                    <div className="w3-padding w3-border-bottom pointer w3-hover-light-grey" onClick={e=>saveToChart(row.song_id)}>
                                        <font className="block">{row.title}</font>
                                        <font className="block w3-small w3-opacity">{row.name}</font>
                                    </div>
                                ))}
                            </>:<Alert severity="warning">No matches</Alert>}
                        </div>
                        <div className="w3-col m1">&nbsp;</div>
                        <div className="w3-col m6">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Artist</TableCell>
                                        <TableCell>Song</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {songs.map((row,index) => (
                                        <TableRow hover key={row.id}>
                                            <TableCell padding="none" align="center">{index+1}</TableCell>
                                            <TableCell padding="none">{row.name}</TableCell>
                                            <TableCell padding="none">{row.title}</TableCell>
                                            <TableCell sx={{padding:"5px"}}>
                                                <Button variant="outlined" color="error" size="small">Remove</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabPanel>
            </Box>
        </>
    )
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

function Users(){
    const[users,setUsers] = useState([]);
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getUsers = () => {
        $.get("api/", {getUsers:"true"}, function(res){
            setUsers(res);
        })
    }

    useEffect(()=>{
        getUsers();
    }, []);

    return (
        <>
            <div className="w3-padding">
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Date Reg</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index)=>(
                                <TableRow key={row.index} hover>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.phone}</TableCell>
                                    <TableCell padding="none">{row.email}</TableCell>
                                    <TableCell padding="none">{row.date_reg}</TableCell>
                                    <TableCell padding="none">{row.country_data.name}</TableCell>
                                    <TableCell padding="none">{row.location}</TableCell>
                                    <TableCell padding="none">{row.status}</TableCell>
                                    <TableCell sx={{padding:"5px"}}>{row.status == "deactivated" ? <Button size="small" variant="contained">Activate</Button>:<Button size="small" variant="contained" color="error">Deactivate</Button>}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>
        </>
    )
}

function Genres(){
    const[genres,setGenres] = useState([]);
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getGenres = () => {
        $.get("api/", {getGenres:"true"}, function(res){
            setGenres(res);
        })
    }

    useEffect(()=>{
        getGenres();
    }, []);

    return (
        <>
            <div className="w3-padding">
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Songs</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {genres.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index)=>(
                                <TableRow key={row.index} hover>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.songs}</TableCell>
                                    <TableCell padding="none">{row.status}</TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button size="small" variant="contained">Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={genres.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>
        </>
    )
}

function SystemValues(){
    const [value,setValue] = useState(0);
    
    const handleChange = (event,newValue) => {
        setValue(newValue);
    }

    return (
        <>
            <div className="w3-padding">
                <Box>
                    <Box sx={{borderBottom:1,borderColor:'divider'}}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Countries" sx={{textTransform:"none"}} {...a11yProps(0)} />
                            <Tab label="Artist & Country" sx={{textTransform:"none"}} {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Countries />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ArtistCountry />
                    </TabPanel>
                </Box>
            </div>
        </>
    )
}

function Adverts(){
    const [value,setValue] = useState(0);
    
    const handleChange = (event,newValue) => {
        setValue(newValue);
    }

    return (
        <>
            <div className="w3-padding">
                <Box>
                    <Box sx={{borderBottom:1,borderColor:'divider'}}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Active" sx={{textTransform:"none"}} {...a11yProps(0)} />
                            <Tab label="Expired" sx={{textTransform:"none"}} {...a11yProps(1)} />
                            <Tab label="Summary" sx={{textTransform:"none"}} {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <ActiveAdverts />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ExpiredAdverts />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <h1>Summary</h1>
                    </TabPanel>
                </Box>
            </div>
        </>
    )
}

function Countries(){
    const [countries,setCountries] = useState([]);
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, function(response){
            setCountries(response);
        })
    }

    useEffect(()=>{
        getCountries();
    }, []);

    return (
        <>
            <div className="w3-padding">
                <Button variant="contained">Add Country</Button>

                <Paper sx={{mt:2}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Code</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Neighbours</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {countries.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index)=>(
                                <TableRow hover key={row.id}>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.code}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.neighbours}</TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" sx={{textTransform:"none"}}>Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={countries.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>
        </>
    )
}

function Music(){
    const [rows,setRows] = useState([]);
    const [genres,setGenres] = useState([]);
    const [page,setPage] = useState(0);
    const [count,setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [open,setOpen] = useState({
        add:false,
        manage:false,
        web:false
    });
    const [active,setActive]= useState([]);
    const anchor = "manage";
    const [search,setSearch] = useState("");
    const [results,setResults]= useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getMusic();
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getMusic();
    };

    const getMusic = () => {
        $.get("api/", {getSongs:"true",start:(page*rowsPerPage),limit:rowsPerPage}, function(response){
            setRows(response);
        })
    }

    const getGenres = () => {
        $.get("api/", {getGenres:"true"}, function(response){
            setGenres(response);
        })
    }

    const getCount = () => {
        $.get("api/", {countSongs:"true"}, function(response){
            setCount(response.count);
        })
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen({ ...state, [anchor]: open });
    };

    useEffect(()=>{
        getMusic();
        getGenres();
        getCount();
    }, []);

    const saveChanges = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setOpen({...open, manage:false});
                    getArtists();
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
        if(search.length > 0){
            $.get("api/", {searchArtist:search}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [search]);

    return (
        <>
            <div className="w3-padding">
                <Button variant="contained" onClick={e=>setOpen({...open,add:true})} sx={{textTransform:"none"}}>Upload Song</Button> 
                <Button variant="contained" onClick={e=>setOpen({...open,web:true})} sx={{ml:2,textTransform:"none"}}>Add Song</Button>

                <Paper sx={{mt:2}}>
                    <Input placeholder="Search Artist" value={search} onChange={e=>setSearch(e.target.value)} sx={{width:"200px"}} />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>WebId</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Artist</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Genre</TableCell>
                                <TableCell>Plays</TableCell>
                                <TableCell>Downloads</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.length > 0 ? <>
                                {results.map((row,index) => (
                                    <TableRow hover key={row.song_id}>
                                        <TableCell padding="none" align="center">{rowsPerPage*page + (index+1)}</TableCell>
                                        <TableCell padding="none">{row.webid}</TableCell>
                                        <TableCell padding="none">{row.title}</TableCell>
                                        <TableCell padding="none">{row.name}</TableCell>
                                        <TableCell padding="none">{row.length}</TableCell>
                                        <TableCell padding="none">{row.genre_data.name}</TableCell>
                                        <TableCell padding="none">{row.plays}</TableCell>
                                        <TableCell padding="none">
                                            {row.downloads}
                                        </TableCell>
                                        <TableCell sx={{padding:"5px"}}>
                                            <Button variant="contained" size="small" onClick={e=>{
                                                setActive(row);
                                                setOpen({...open, manage:true});
                                            }}>Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>:
                            <>
                            {rows.map((row,index) => (
                                <TableRow hover key={row.song_id}>
                                    <TableCell padding="none" align="center">{rowsPerPage*page + (index+1)}</TableCell>
                                    <TableCell padding="none">{row.webid}</TableCell>
                                    <TableCell padding="none">{row.title}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.length}</TableCell>
                                    <TableCell padding="none">{row.genre_data.name}</TableCell>
                                    <TableCell padding="none">{row.plays}</TableCell>
                                    <TableCell padding="none">
                                        {row.downloads}
                                    </TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" onClick={e=>{
                                            setActive(row);
                                            setOpen({...open, manage:true});
                                        }}>Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}</>}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={Number(count)}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>

            <Drawer
                anchor="right"
                open={open.manage}
                onClose={()=>setOpen({...open, manage:false})}
                >
                <div style={{width:(.85*window.innerWidth)+"px"}} className="w3-padding-large">
                    <font>Manage {active.title+" by "+active.name}</font>

                    <div className="pt-15 pb-15 w3-center">
                        <img src={"../artworks/"+active.resampled_artwork} width="50%" className="rounded" />
                        <br />
                        <br />
                        <Button variant="outlined" size="small">Change Artwork</Button>
                    </div>

                    <form onSubmit={saveChanges}>
                        <input type="hidden" name="song_id" value={active.song_id} />
                        <TextField label="Title" size="small" name="song_title_edit" fullWidth value={active.title} onChange={e=>setActive({...active, title:e.target.value})} sx={{mt:2}} />
                        <TextField label="WebId" size="small" name="webid" fullWidth value={active.webid} onChange={e=>setActive({...active, webid:e.target.value})} sx={{mt:2}} />
                        <TextField select label="Genre" size="small" sx={{mt:2}} hiddenLabel name="genre" value={active.genre} onChange={e=>setActive({...active, genre:e.target.value})} fullWidth>
                            {genres.map((row,index) => (
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Mp3 URL" size="small" multiline rows={3} name="mp3_url" fullWidth value={active.mp3_url} onChange={e=>setActive({...active, mp3_url:e.target.value})} sx={{mt:2,mb:3}} />
                        
                        <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Changes</Button>
                    </form>
                    <hr />
                    <div className="pt-15">
                        <Button variant="contained" color="error">Delete</Button>
                    </div>
                </div>
            </Drawer>

            {open.add ? <AddMusic onClose={()=>{
                setOpen({...open, add:false});
                getMusic();
                getCount();
            }} />:""}

            {open.web ? <AddWebMusic onClose={()=>{
                setOpen({...open, add:false});
                getMusic();
                getCount();
            }} />:""}
        </>
    )
}

function AddMusic(props){
    const [open,setOpen] = useState(true);
    const [value,setValue] = useState("");
    const [results,setResults] = useState([]);
    const [artist,setArtist] = useState({});

    const[genres,setGenres] = useState([]);
    
    const getGenres = () => {
        $.get("api/", {getGenres:"true"}, function(res){
            setGenres(res);
        })
    }

    useEffect(()=>{
        getGenres();
    }, []);

    useEffect(()=>{
        if(value != ""){
            //
            $.get("api/", {searchArtist:value}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [value]);

    const saveSong = (event) => {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    form.reset();
                    setOpen(false);
                    props.onClose();
                    Toast("Success");
                }
                else{
                    Toast(message);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={()=>setOpen(false)}>
                <div className="w3-padding-large">
                    <font className="block w3-large">Add New Music</font>

                    <form onSubmit={saveSong}>
                        <TextField label="Title" fullWidth name="song_title" sx={{mt:2}} />
                        <input type="hidden" name="artist_id" value={artist.id}/>

                        {artist.id != undefined? <Chip label={artist.name} variant="outlined" sx={{mt:2}} onDelete={()=>setArtist({})} />:
                        <>
                            <TextField label="Main Artist" value={value} onChange={e=>setValue(e.target.value)} sx={{mt:2}} fullWidth/>
                            {results.map((row,index)=>(
                                <div className="w3-padding" key={row.id}>
                                    <font className="block">{row.name}</font>
                                    <Chip label="Set this" size='small' variant="outlined" onClick={e=>{
                                        setArtist(row);
                                    }} />
                                </div>
                            ))}
                        </>}

                        <TextField label="Genre" fullWidth name="genre" select size="small" sx={{mt:2}}>
                            {genres.map((row,index)=>(
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Artwork" fullWidth name="artwork" type="file" sx={{mt:2}} />
                        <TextField label="Song File" fullWidth name="file" type="file" sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Upload Song</Button>
                    </form>

                    <div className="pt-15 pb-15 clearfix">
                        <Button className="float-right" variant="contained" color="error" onClick={()=>{
                            setOpen(false)
                        }}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function AddWebMusic(props){
    const [open,setOpen] = useState(true);
    const [value,setValue] = useState("");
    const [results,setResults] = useState([]);
    const [artist,setArtist] = useState({});
    const [artworkSrc,setArtworkSrc] = useState("upload");

    const[genres,setGenres] = useState([]);
    
    const getGenres = () => {
        $.get("api/", {getGenres:"true"}, function(res){
            setGenres(res);
        })
    }

    useEffect(()=>{
        getGenres();
    }, []);

    useEffect(()=>{
        if(value != ""){
            //
            $.get("api/", {searchArtist:value}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [value]);

    const saveSong = (event) => {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    form.reset();
                    setOpen(false);
                    props.onClose();
                    Toast("Success");
                }
                else{
                    Toast(message);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={()=>setOpen(false)}>
                <div className="w3-padding-large">
                    <font className="block w3-large">Add New Music</font>

                    <form onSubmit={saveSong}>
                        <TextField label="Title" fullWidth name="song_title" sx={{mt:2}} />
                        <input type="hidden" name="artist_id" value={artist.id}/>

                        {artist.id != undefined? <Chip label={artist.name} variant="outlined" sx={{mt:2}} onDelete={()=>setArtist({})} />:
                        <>
                            <TextField label="Main Artist" value={value} onChange={e=>setValue(e.target.value)} sx={{mt:2}} fullWidth/>
                            {results.map((row,index)=>(
                                <div className="w3-padding" key={row.id}>
                                    <font className="block">{row.name}</font>
                                    <Chip label="Set this" size='small' variant="outlined" onClick={e=>{
                                        setArtist(row);
                                    }} />
                                </div>
                            ))}
                        </>}

                        <TextField label="Genre" fullWidth name="genre" select size="small" sx={{mt:2}}>
                            {genres.map((row,index)=>(
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <div className="pt-10 pb-10">
                            <input type="radio" id="upload" value={"upload"} onChange={e=>setArtworkSrc("upload")} checked={artworkSrc == "upload"}/>
                            <label htmlFor="upload">Upload Artwork</label><br/>

                            <input type="radio" id="web_src" value={"upload"} onChange={e=>setArtworkSrc("web_src")} checked={artworkSrc == "web_src"}/>
                            <label htmlFor="web_src">Web Source</label>
                        </div>
                        <TextField label="Artwork" fullWidth name="artwork" type={artworkSrc == "upload" ? "file":"text"} sx={{mt:2}} />
                        <TextField label="Song File" fullWidth name="mp3_url" sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Add Song</Button>
                    </form>

                    <div className="pt-15 pb-15 clearfix">
                        <Button className="float-right" variant="contained" color="error" onClick={()=>{
                            setOpen(false)
                        }}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function ArtistDetails(){
    const {active,setActive} = useContext(Context);
    const [value,setValue] = useState(0);
    const [search,setSearch] = useState("");
    const [results,setResults] = useState([]);
    const [songs,setSongs] = useState([]);
    const [activeSong,setActiveSong] = useState({});
    const [open,setOpen] = useState({
        manage:false,
        transfer:false,
        album:false,
    });

    const [albums,setAlbums] = useState([]);

    const getAlbums = () => {
        if(active.id != undefined){
            $.get("api/", {getArtistAlbums:active.id}, function(response){
                setAlbums(response);
            })
        }
    }

    const getSongs = () => {
        if(active.id != undefined){
            $.get("api/", {getArtistSongs:active.id}, function(response){
                setSongs(response.map(r=>{
                    r.checked = false;
                    return r;
                }));
            })
        }
    }

    useEffect(()=>{
        getAlbums();
        getSongs();
    }, []);

    useEffect(()=>{
        getAlbums();
        getSongs();
    }, [active]);

    const handleChange = (event,newValue) => {
        setValue(newValue);
    }

    const checkAllSongs = (event) => {
        if(event.target.checked){
            setSongs(songs.map(r=>{
                r.checked = true;
                return r;
            }))
        }
        else{
            setSongs(songs.map(r=>{
                r.checked = false;
                return r;
            }))
        }
    }

    const albumImage = (url) => {
        if(url.indexOf("http://") != -1 || url.indexOf("https://") != -1){
            return url;
        }
        else{
            return "../uploads/albums/"+url;
        }
    }

    return (
        <>
            <Box>
                <Box sx={{borderBottom:1,borderColor:'divider'}}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Albums" sx={{textTransform:"none"}} {...a11yProps(0)} />
                        <Tab label="Songs" sx={{textTransform:"none"}} {...a11yProps(1)} />
                        <Tab label="Details" sx={{textTransform:"none"}} {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <h1>Albums</h1>
                    <Box sx={{p:1}}>
                        <Button variant="contained" onClick={e=>setOpen({...open, album:true})}>Add Album</Button> <Button variant="contained" sx={{ml:2}}>Upload Zip</Button>
                    </Box>
                    <Paper sx={{mt:1}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Year</TableCell>
                                    <TableCell>Supporting Artists</TableCell>
                                    <TableCell>Songs</TableCell>
                                    <TableCell>Plays</TableCell>
                                    <TableCell>Artwork</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {albums.map((row,index) => (
                                    <TableRow hover key={row.id}>
                                        <TableCell padding="none" align="center">{index+1}</TableCell>
                                        <TableCell padding="none">{row.name}</TableCell>
                                        <TableCell padding="none">{row.year}</TableCell>
                                        <TableCell padding="none">{row.supporting_artists}</TableCell>
                                        <TableCell padding="none">{row.songs}</TableCell>
                                        <TableCell padding="none">{row.plays}</TableCell>
                                        <TableCell padding="none">
                                            <img src={albumImage(row.image)} width={"30"} />
                                        </TableCell>
                                        <TableCell sx={{padding:"5px"}}>
                                            <Button variant="outlined" size="small" startIcon={<i className="fa fa-file-archive w3-small"/>}>Upload Zip</Button>
                                            <Button variant="contained" size="small" sx={{ml:2}}>Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <h1>Songs</h1>
                    <Paper sx={{mt:2}}>
                        <Input placeholder="Search Artist" value={search} onChange={e=>setSearch(e.target.value)} sx={{width:"200px"}} />
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <input type="checkbox" onChange={checkAllSongs}/>
                                    </TableCell>
                                    <TableCell>#</TableCell>
                                    <TableCell>WebId</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Artist</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Genre</TableCell>
                                    <TableCell>Plays</TableCell>
                                    <TableCell>Downloads</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {songs.map((row,index) => (
                                    <TableRow hover key={row.song_id}>
                                        <TableCell>
                                            <input type="checkbox" checked={row.checked} onChange={e=>{
                                                setSongs(songs.map((r,i)=>{
                                                    if(i == index){
                                                        if(e.target.checked){
                                                            r.checked = true;
                                                        }
                                                        else{
                                                            r.checked = false;
                                                        }
                                                    }
                                                    return r;
                                                }))
                                            }} />
                                        </TableCell>
                                        <TableCell padding="none" align="center">{(index+1)}</TableCell>
                                        <TableCell padding="none">{row.webid}</TableCell>
                                        <TableCell padding="none">{row.title}</TableCell>
                                        <TableCell padding="none">{row.name}</TableCell>
                                        <TableCell padding="none">{row.length}</TableCell>
                                        <TableCell padding="none">{row.genre_data.name}</TableCell>
                                        <TableCell padding="none">{row.plays}</TableCell>
                                        <TableCell padding="none">
                                            {row.downloads}
                                        </TableCell>
                                        <TableCell sx={{padding:"5px"}}>
                                            <Button variant="contained" size="small" onClick={e=>{
                                                setActive(row);
                                                setOpen({...open, manage:true});
                                            }}>Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/*<TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                            component="div"
                            count={Number(count)}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />*/}
                    </Paper>

                    <Box sx={{p:2}}>
                        {songs.filter(r=>r.checked).length > 0 ? <>
                            <Button variant="contained" color="warning" onClick={e=>setOpen({...open, transfer:true})}>Transfer</Button> <Button variant="contained" sx={{ml:2}}>Make Album</Button>
                        </>:""}
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <h1>Details</h1>
                </TabPanel>
            </Box>

            {open.transfer ? <TransferSongs songs={songs} onClose={()=>{
                setOpen({...open, transfer:false});
                getSongs();
            }} />:""}

            {open.album ? <CreateAlbum artist={active} onClose={()=>{
                setOpen({...open, album:false});
                getAlbums();
            }} />:""}
        </>
    )
}

function CreateAlbum(props){
    const [artworkSrc,setArtworkSrc] = useState("upload");
    const {active,setActive} = useContext(Context);
    const [open,setOpen] = useState(true);

    const saveAlbum = (event) => {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    props.onClose();
                    setOpen(false);
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

    return (
        <>
            <Dialog open={open} onClose={()=>setOpen(false)}>
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="w3-large">Create Album</font>
                    <form onSubmit={saveAlbum}>
                        <input type="hidden" name="artist" value={active.id} />
                        <TextField fullWidth label="Album title" name="album_title" sx={{mt:2}} />
                        <div className="pt-10 pb-10">
                            <input type="radio" id="upload" value={"upload"} onChange={e=>setArtworkSrc("upload")} checked={artworkSrc == "upload"}/>
                            <label htmlFor="upload">Upload Artwork</label><br/>

                            <input type="radio" id="web_src" value={"upload"} onChange={e=>setArtworkSrc("web_src")} checked={artworkSrc == "web_src"}/>
                            <label htmlFor="web_src">Web Source</label>
                        </div>
                        <TextField label="Artwork" fullWidth name="artwork" type={artworkSrc == "upload" ? "file":"text"} sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Add Album</Button>
                    </form>

                    <div className="pt-15 pb-15 clearfix">
                        <Button className="float-right" variant="contained" color="error" onClick={()=>{
                            setOpen(false);
                            props.onClose();
                        }}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function TransferSongs(props){
    const [value,setValue] = useState("");
    const [results,setResults] = useState([]);
    const [open,setOpen] = useState(true);

    useEffect(()=>{
        if(value != ""){
            //
            $.get("api/", {searchArtist:value}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [value]);

    return (
        <>
            <Dialog
                open={open}
                onClose={()=>setOpen({...open,transfer:false})}>
                <div className="w3-padding-large">
                    <font>Transfer songs to another artists</font>
                    <div className="pt-15">
                        {props.songs.filter(r=>r.checked).map((row,index)=>(
                            <div className="w3-padding">
                                <input type="checkbox" checked={row.checked} /> {row.title}
                            </div>
                        ))}

                        <TextField label="Destine Artist" value={value} onChange={e=>setValue(e.target.value)} sx={{mt:2}} fullWidth/>
                        {results.map((row,index)=>(
                            <div className="w3-padding" key={row.id}>
                                <font className="block">{row.name}</font>
                                <Chip label="Transfer" onClick={e=>{
                                    $.post("api/", {newArtist:row.id,songs:props.songs.filter(r=>r.checked).map(r=>r.id).join(",")}, function(response){
                                        Toast(response);
                                        setOpen(false);
                                        props.onClose();
                                    })
                                }} />
                            </div>
                        ))}
                        <Button variant="contained" sx={{mt:2}}>Transfer Now</Button>
                    </div>

                    <div className="pt-15 pb-15 clearfix">
                        <Button className="float-right" variant="contained" color="error" onClick={()=>{
                            setOpen(false)
                            props.onClose();
                        }}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function ArtistCountry(){
    const [countries,setCountries] = useState([]);
    const [value,setValue] = useState("");
    const [country,setCountry] = useState(0);
    const [results,setResults] = useState([]);
    
    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, function(response){
            setCountries(response);
        })
    }

    useEffect(()=>{
        getCountries();
    }, []);

    const searchMe = () => {
        $.get("api/", {searchArtistNoCountry:value}, function(res){
            setResults(res);
        })
    }

    useEffect(()=>{
        if(value == ""){
            setResults([]);
        }
        else{
            searchMe();
        }
    }, [value]);

    return (
        <>
            <div className="w3-padding">
                <select value={country} onChange={e=>setCountry(e.target.value)}>
                    {countries.map((row,index)=>(
                        <option value={row.id}>{row.name}</option>
                    ))}
                </select>

                <div className="border" style={{width:"400px"}}>
                    <Input placeholder="search artist" value={value} onChange={e=>setValue(e.target.value)} fullWidth />
                    {results.map((row,index)=>(
                        <div className="w3-padding w3-hover-light-grey pointer" onClick={e=>{
                            $.post("api/", {updateArtistCountry:row.id,country:country}, function(res){
                                searchMe();
                            })
                        }}>{row.name}</div>
                    ))}
                </div>
            </div>
        </>
    )
}

function ActiveAdverts(){
    const [adverts,setAdverts] = useState([]);
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [active,setActive] = useState({
        file:""
    })
    const [open,setOpen] = useState({
        add:false,
        edit:false,
        images:false
    })

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getAdverts = () => {
        $.get("api/", {getAdverts:"true"}, function(response){
            setAdverts(response);
        })
    }

    useEffect(()=>{
        getAdverts();
    }, []);

    const addAdvert = (event) => {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    form.reset();
                    getAdverts();
                    setOpen({...open, add:false});
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

    const editAdvert = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(res){
            if(res.status){
                setOpen({...open, edit:false});
                Toast("Success!");
                getAdverts();
            }
            else{
                Toast(res.message);
            }
        })
    }

    const attachType = (str) => {
        if(str == ""){
            return "";
        }

        let images = ["png", "jpeg", "gif", "jpg","webp"];
        let chars = str.split("."), ext = chars[chars.length - 1].toLowerCase();
        if(images.includes(ext)){
            return "image";
        }
        else if(ext == "mp4"){
            return "video";
        }
    }

    const arrayReverse = (array) => {
        array.reverse();
        return array()
    }

    const changeAdvertPic = (event) => {
        //
        let input = document.createElement("input");
        input.type = 'file';
        input.accept = 'image/*';

        input.addEventListener('change', function(event){
            //upload file
            let formdata = new FormData();
            formdata.append("advert_picture", input.files[0]);
            formdata.append("advert_id", active.id);

            post("api/", formdata, function(response){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        setActive({...active, square_image:res.image});
                        getAdverts();
                        Toast("Success");
                        setOpen({...open, images:false});
                    }
                    else{
                        Toast(res.message);
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        })
        input.click();
    }

    const changeAdvertFile = (event) => {
        //
        let input = document.createElement("input");
        input.type = 'file';
        input.accept = 'image/*, .mp4';

        input.addEventListener('change', function(event){
            //upload file
            let formdata = new FormData();
            formdata.append("advert_file", input.files[0]);
            formdata.append("advert_id", active.id);

            post("api/", formdata, function(response){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        setActive({...active, file:res.file});
                        getAdverts();
                        Toast("Success");
                        setOpen({...open, images:false});
                    }
                    else{
                        Toast(res.message);
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        })
        input.click();
    }

    return (
        <>
            <div className="w3-padding">
                <Button variant="contained" onClick={e=>setOpen({...open, add:true})}>Add Advert</Button>

                <Paper sx={{mt:2}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Link</TableCell>
                                <TableCell>Picture</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adverts.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index)=>(
                                <TableRow hover key={row.id}>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.company}</TableCell>
                                    <TableCell padding="none">{row.title}</TableCell>
                                    <TableCell padding="none">{row.description.substring(0,60)+"..."}</TableCell>
                                    <TableCell padding="none">{row.phone}</TableCell>
                                    <TableCell padding="none">{row.email}</TableCell>
                                    <TableCell padding="none">{row.link}</TableCell>
                                    <TableCell padding="none">
                                        <img src={"../uploads/"+row.square_image} onClick={e=>{
                                            setActive(row);
                                            setOpen({...open, images:true});
                                        }} width="30" className="rounded"/>
                                    </TableCell>
                                    <TableCell padding="none">{row.date}</TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" sx={{textTransform:"none"}} onClick={e=>{
                                            setActive(row);
                                            setOpen({...open, edit:true});
                                        }}>Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={adverts.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>

            <Dialog
                open={open.add}
                onClose={()=>setOpen({...open, add:false})}
                >
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="w3-large">Add Advert</font>
                    <form onSubmit={addAdvert}>
                        <TextField label="Company" fullWidth size="small" name="company" sx={{mt:2}} />
                        <TextField label="Title" fullWidth size="small" name="title" sx={{mt:2}} />
                        <TextField label="Description" fullWidth size="small" name="description" multiline rows={3} sx={{mt:2}} />
                        <TextField label="Phone" fullWidth size="small" name="phone" sx={{mt:2}} />
                        <TextField label="Email" fullWidth size="small" name="email" sx={{mt:2}} />
                        <TextField label="Link" fullWidth size="small" name="link" sx={{mt:2}} />
                        <TextField label="Display Image" fullWidth size="small" name="display" type="file" sx={{mt:2}} />
                        <TextField label="File" fullWidth size="small" name="file" type="file" sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Submit</Button>
                    </form>

                    <div className="clearfix pt-15 pb-15">
                        <Button variant="contained" color="error" className="float-right" onClick={()=>setOpen({...open, add:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog
                open={open.images}
                onClose={()=>setOpen({...open, edit:false})}
                >
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="w3-large">Change Attachements</font>
                    <div className="pt-15 w3-center">
                        <font className="w3-opacity w3-small block">Display Picture</font>
                        <img src={"../uploads/"+active.square_image} width={"70%"} className="rounded" /><br/>
                        <Button size="small" sx={{mt:1}} onClick={changeAdvertPic} variant="outlined">Change</Button>
                        <hr/>

                        <font className="w3-opacity w3-small block">File attachments</font>
                        {attachType(active.file) == "image" ? <>
                            <img src={"../uploads/"+active.file} width={"70%"} className="rounded" />
                        </>:<>
                            <video width={"70%"} controls>
                                <source src={"../uploads/"+active.file} type="video/mp4"/>
                            </video>
                        </>}
                        <br/>
                        <Button size="small" sx={{mt:1}} onClick={changeAdvertFile} variant="outlined">Change</Button>
                    </div>

                    <div className="clearfix pt-15 pb-15">
                        <Button variant="contained" color="error" className="float-right" onClick={()=>setOpen({...open, images:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>

            <Drawer
                open={open.edit}
                onClose={()=>setOpen({...open, edit:false})}
                anchor="right">
                <div className="w3-padding" style={{width:"300px"}}>
                    <font className="w3-large">Edit Advert</font>

                    <form onSubmit={editAdvert}>
                        <input type="hidden" name="advert_id" value={active.id} />
                        <TextField label="Company" fullWidth size="small" name="company_edit" sx={{mt:2}} value={active.company} onChange={e=>setActive({...active, company:e.target.value})} />
                        <TextField label="Title" fullWidth size="small" name="title" sx={{mt:2}} value={active.title} onChange={e=>setActive({...active, title:e.target.value})} />
                        <TextField label="Description" fullWidth size="small" name="description" multiline rows={3} sx={{mt:2}} value={active.description} onChange={e=>setActive({...active, description:e.target.value})} />
                        <TextField label="Phone" fullWidth size="small" name="phone" sx={{mt:2}} value={active.phone} onChange={e=>setActive({...active, phone:e.target.value})} />
                        <TextField label="Email" fullWidth size="small" name="email" sx={{mt:2}} value={active.email} onChange={e=>setActive({...active, email:e.target.value})} />
                        <TextField label="Link" fullWidth size="small" name="link" sx={{mt:2,mb:3}} value={active.link} onChange={e=>setActive({...active, link:e.target.value})} />

                        <Button variant="contained" type="submit">Save Changes</Button>
                    </form>

                    <div className="clearfix pt-15 pb-15">
                        <Button variant="contained" color="error" onClick={()=>setOpen({...open, edit:false})}>Close</Button>
                    </div>
                </div>
            </Drawer>
        </>
    )
}

function ExpiredAdverts(){
    return (
        <></>
    )
}