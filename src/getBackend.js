import axios from 'axios'

let scholarships = {};
class Backend {

    constructor(){};
    getScholarships(){
        axios
        .get("https://laesa-backend.herokuapp.com/api/scholarships")
        .then((res) => {
            scholarships = res.data;
            console.log(scholarships);
        });
    }
};
export default Backend;