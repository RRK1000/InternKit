import React from "react";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
}));

export default function DefaultPage() {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="lg">
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button>
          <Link href="/signup" color="primary">
            Company Login
          </Link>{" "}
        </Button>
        <Button>
          <Link href="/signin" color="primary">
            Student Login
          </Link>
        </Button>
      </ButtonGroup>
    </Container>
  );
}
