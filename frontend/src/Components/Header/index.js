import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Link from "@material-ui/core/Link";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
const isLoggedIn = require("../../util/auth").isLoggedIn;

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
});

class Header extends React.Component {
    render() {
        const { classes } = this.props;
        const loggedInComponent = (
            <List component="nav">
                <ListItem component="div">
                    <ListItemText inset>
                        <Link href="/" color="inherit">
                            Home
                        </Link>
                    </ListItemText>

                    <ListItemText inset>
                        <Link href="/profile" color="inherit">
                            Profile
                        </Link>
                    </ListItemText>

                    <ListItemText inset>
                        <Link href="/logout" color="inherit">
                            Logout
                        </Link>
                    </ListItemText>
                </ListItem>
            </List>
        );
        const loggedOutComponent = (
            <List component="nav">
                <ListItem component="div">
                    <ListItemText inset>
                        <Link href="/" color="inherit">
                            Home
                        </Link>
                    </ListItemText>

                    <ListItemText inset>
                        <Link href="/signin" color="inherit">
                            Sign In
                        </Link>
                    </ListItemText>

                    <ListItemText inset>
                        <Link href="/signup" color="inherit">
                            Register
                        </Link>
                    </ListItemText>
                </ListItem>
            </List>
        );
        let component = loggedOutComponent;
        if(isLoggedIn()) component = loggedInComponent;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h5" className={classes.title}>
                            InternKit
                        </Typography>

                        {component}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
export default withStyles(useStyles)(Header);
