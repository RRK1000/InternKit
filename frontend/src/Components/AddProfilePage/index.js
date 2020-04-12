import React from "react";
import StudentProfile from "./StudentProfile";
import CompanyProfile from "./CompanyProfile";
import { useGetAndSet } from 'react-context-hook';


// const useStyles = makeStyles((theme) => ({
//     root: {
//         "& .MuiTextField-root": {
//             margin: theme.spacing(1),
//             width: "50ch",
//         },
//     },
//     heading: {
//         margin: theme.spacing(2),
//     },
//     button: {
//         marginLeft: theme.spacing(1),
//         marginTop: theme.spacing(1),
//     },
//     caption: {
//         marginLeft: theme.spacing(1),
//     },
// }));

export default function AddProfile() {
    const [usertype, setUserType] = useGetAndSet("usertype");

    if (usertype === "student") return <StudentProfile />;
    else return <CompanyProfile />;
}
