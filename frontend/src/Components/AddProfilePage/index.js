import React from "react";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import StudentProfile from "./StudentProfile";
// import CompanyProfile from "./CompanyProfile";

const useStyles = (theme) => ({
    root: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "50ch",
        },
    },
    heading: {
        margin: theme.spacing(2),
    },
    button: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    caption: {
        marginLeft: theme.spacing(1),
    },
});

class AddProfile extends React.Component {
    constructor(props) {
        super(props);
        // To Do, pass username and usertype as props
        this.state = {
            usertype: "student",
        };
    }
    
    render() {
        if(localStorage.getItem("profile")===true) return <Redirect to="/" />
        if (this.state.usertype === "student") return <StudentProfile />;
        else return <div></div>;
    }
}
export default withStyles(useStyles)(AddProfile);
