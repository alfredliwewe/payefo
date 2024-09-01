const {TextField,Button,Alert} = MaterialUI;
const {useState} = React;

window.onload = function(){
    ReactDOM.render(<Login />, document.getElementById("root"));
}

function Login(){
    const [error,setError] = useState("")
    const login = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    window.location = './';
                }
                else{
                    setError(res.message);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m4">&nbsp;</div>
                <div className="w3-col m3 w3-padding-large">
                    <div className="pt-50">
                        <font className="w3-large">Login Below</font>

                        {error.length > 0 ? <Alert severity="error">{error}</Alert>:""}

                        <form onSubmit={login} className="pt-15">
                            <TextField label="Email" fullWidth sx={{mt:2}} name="login_email" />
                            <TextField label="Password" type="password" fullWidth sx={{mt:2,mb:3}} name="password" />

                            <Button variant="contained" type="submit">Login</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}