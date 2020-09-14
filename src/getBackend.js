import axios from 'axios'

let scholarships = {};
class Backend {

    constructor(){};
    // not working
    getScholarships(callback){
        var tempString="";
        axios
        .get("https://laesa-backend.herokuapp.com/api/scholarships")
        .then((res) => {
            scholarships = res.data;
            console.log(scholarships);
            for (var i=0; i< scholarships.length; i++){
                        tempString += `${scholarships[i].title}: ${scholarships[i].description}. Due on ${scholarships[i].deadline}`;
                        tempString +='\n\n';
                    }
            
        });
        // callback()
    }
};
export default Backend;