import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MyRow from './myRowInternship';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function MyTable(props) {
  const classes = useStyles();
  const rows = props.rows;
  return rows.length === 0 ? <div>No internships found.</div> :
    (
      < TableContainer component={Paper} >
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Internship name</TableCell>
              <TableCell align="right">Branch</TableCell>
              <TableCell align="right">City</TableCell>
              <TableCell align="right">Stipend</TableCell>
              {/* <TableCell align="right"></TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <MyRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer >

    );
}
