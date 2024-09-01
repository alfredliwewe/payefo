var Strings = (function(){
    function words(stmt: String, count: number){
        count = count == undefined ? 6 : count

        let chars: String[] = stmt.split(" ");
        if(chars.length > count){
            chars = chars.slice(0,count)
        }

        return chars.join(" ");
    }

    function uc_words(stmt: String){
        let chars: String[] = stmt.split(" ");
        for(let i:number = 0; i < chars.length; i++){
            chars[i] = chars[i].charAt(0).toUpperCase() + chars[i].substring(1).toLowerCase();
        }

        return chars.join(" ");
    }

    return {
        words,
        uc_words
    }
})();