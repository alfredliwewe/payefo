function PaychanguCheckout(props){
    //
    let result = confirm("Mark paid");
    if(result){
        window.location = props.callback_url+(props.callback_url.includes("?") ? "" :"?")+"tx_ref="+props.tx_ref;
    }
}