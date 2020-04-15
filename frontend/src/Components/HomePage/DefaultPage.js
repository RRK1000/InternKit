import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from "react-router-dom";
import { useSetStoreValue } from "react-context-hook";
import company from "./CompanyLogin.jpg";
import student from "./StudentLogin.jpg";

const images = [
    {
        url: company,
        title: "For Companies",
        width: "50%",
        usertype: "employee",
    },
    {
        url: student,
        title: "For Students",
        width: "50%",
        usertype: "student",
    },
];

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        minWidth: 300,
        width: "100%",
    },
    image: {
        position: "relative",
        height: 400,
        // width: 500,
        [theme.breakpoints.down("xs")]: {
            width: "100% !important", // Overrides inline-style
            height: 100,
        },
        "&:hover, &$focusVisible": {
            zIndex: 1,
            "& $imageBackdrop": {
                opacity: 0.15,
            },
            "& $imageMarked": {
                opacity: 0,
            },
            "& $imageTitle": {
                border: "4px solid currentColor",
            },
        },
    },
    focusVisible: {},
    imageButton: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.common.white,
    },
    imageSrc: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: "cover",
        height: 400, 
        // width: 500,
        backgroundPosition: "center 40%",
    },
    imageBackdrop: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create("opacity"),
    },
    imageTitle: {
        position: "relative",
        padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${
            theme.spacing(1) + 6
        }px`,
    },
    imageMarked: {
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: "absolute",
        bottom: -2,
        left: "calc(50% - 9px)",
        transition: theme.transitions.create("opacity"),
    },
}));

export default function ButtonBases() {
    const classes = useStyles();
    const setUserType = useSetStoreValue("usertype");

    return (
        <div className={classes.root}>
            {images.map((image) => (
                <ButtonBase
                    focusRipple
                    key={image.title}
                    className={classes.image}
                    component={RouterLink}
                    to="/signin"
                    onClick={() => {
                        setUserType(image.usertype);
                    }}
                    focusVisibleClassName={classes.focusVisible}
                    style={{
                        width: image.width,
                    }}
                >
                    <span
                        className={classes.imageSrc}
                        style={{
                            backgroundImage: `url(${image.url})`
                        }}
                    />
                    {/* <img className={classes.imageSrc} src={images.src === "company" ? company : student} /> */}
                    <span className={classes.imageBackdrop} />
                    <span className={classes.imageButton}>
                        <Typography
                            component="span"
                            variant="subtitle1"
                            color="inherit"
                            className={classes.imageTitle}
                        >
                            {image.title}
                            <span className={classes.imageMarked} />
                        </Typography>
                    </span>
                </ButtonBase>
            ))}
        </div>
    );
}
