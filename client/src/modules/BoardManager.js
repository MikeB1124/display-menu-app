import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);
  
    return (
      <>
        <TableRow>
          <TableCell style={{"display": "flex", "gap": "16px"}}>
            <IconButton
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <h3>First Board</h3>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
}

function BoardManager() {
    const [open, setOpen] = useState(false);
    console.log('Sending GET request to http://localhost:8080/boards');

      fetch('/api', {
          method: "GET",
      })
      .then(response => response.json())
      .then(data => console.log(data)).catch(error => console.error(error));

    return (
        <div style={{"backgroundColor": "#bbbbbb", "height": "100vh"}}>
            <h1 style={{"textAlign": "center", "padding": "16px"}}>Boards</h1>
            <div style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}>
                <TableContainer component={Paper} style={{"width": "800px"}}>
                    <Table>
                        <TableBody>
                            {/* <Row row={rows[0]}/> */}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}
  
export default BoardManager;





