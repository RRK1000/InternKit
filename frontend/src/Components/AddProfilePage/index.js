import React from "react";
import StudentProfile from "./StudentProfile";
import CompanyProfile from "./CompanyProfile";
import { useGetAndSet } from 'react-context-hook';


export default function AddProfile() {
    const [usertype] = useGetAndSet("usertype");

    if (usertype === "student") return <StudentProfile />;
    else return <CompanyProfile />;
}
