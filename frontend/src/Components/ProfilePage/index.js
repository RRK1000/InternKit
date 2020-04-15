import React from "react";
import PropTypes from "prop-types";
// import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useStoreValue } from "react-context-hook";

import AccountTab from "./AccountTab";
import PersonalDetailsTab from "./PersonalDetailsTab";
import ProjectsTab from "./ProjectsTab";
import SkillsTab from "./SkillsTab";
import CompanyDescriptionTab from "./CompanyDescriptionTab";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    heading: {
        margin: theme.spacing(3),
    },
    form: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "50ch",
        },
    },
    container: {
        marginTop: theme.spacing(3),
    },
    button: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    caption: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(0),
        paddingTop: theme.spacing(0),
        marginBottom: theme.spacing(2),
        fontSize: 9,
    },
}));

export default function Profile() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const usertype = useStoreValue("usertype");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Typography variant="h3" className={classes.heading}>
                Profile
            </Typography>
            <AppBar position="static" color="default">
                {usertype === "student" ? (
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Account" {...a11yProps(0)} />
                        <Tab label="Personal Details" {...a11yProps(1)} />
                        <Tab label="Projects" {...a11yProps(2)} />
                        <Tab label="Skills" {...a11yProps(3)} />
                    </Tabs>
                ) : (
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Account" {...a11yProps(0)} />
                        <Tab label="Personal Details" {...a11yProps(1)} />
                        <Tab label="Company Description" {...a11yProps(2)} />
                    </Tabs>
                )}
            </AppBar>

            <TabPanel value={value} index={0} dir={theme.direction}>
                <AccountTab />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
                <PersonalDetailsTab />
            </TabPanel>
            {usertype === "student" ? (
                <>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <ProjectsTab />
                    </TabPanel>
                    <TabPanel value={value} index={3} dir={theme.direction}>
                        <SkillsTab />
                    </TabPanel>
                </>
            ) : (
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <CompanyDescriptionTab />
                </TabPanel>
            )}
        </Container>
    );
}
