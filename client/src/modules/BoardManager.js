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
import { Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

function Row(props) {
    const { row, deleteBoard } = props;
    const [open, setOpen] = useState(false);
  
    return (
      <>
        <TableRow>
          <TableCell>
            <div style={{"display": "flex", "justifyContent": "right"}}>
              <Button variant="contained" color="error" onClick={() => deleteBoard(row["_id"])}>Delete</Button>
            </div>
            <div style={{"display": "flex", "gap": "16px"}}>
              <IconButton
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
              <h3>{row.displayName}</h3>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {
                  row.items.map((item, i) => (
                    <div style={{"display": "flex", "gap": "32px"}} key={i}>
                      <Typography variant="h6">{item.name}</Typography> 
                      <Typography variant="h6">${item.price}</Typography> 
                      <Switch checked={item.active ? true : false}/>
                    </div>
                  ))
                }
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
}



function BoardManager() {
  const [boards, setBoards] = useState([])
  const [createBoard, setCreateBoard] = useState(false)
  const [displayNameInput, setDisplayNameInput] = useState("")

  //Get boards
  useEffect(() => {
    fetch('/api/boards', {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
      if (data.result != null){
        setBoards(data.result)
        console.log(data.result)
      }
    })
    .catch(error => console.error(error));
  }, [])

  //Create new board
  function createNewBoard(){
    let newBoard = {
      "displayName": displayNameInput,
      "items": []
    }
    fetch('/api/boards', {
      method: "POST",
      body: JSON.stringify(newBoard)
    })
    .then(response => response.json())
    .then(data => {
      newBoard["_id"] = data.id
      boards.push(newBoard)
      setBoards(boards)
      setCreateBoard(false)
    })
    .catch(error => console.error(error));
  }

  function deleteBoard(id){
    fetch(`/api/boards/${id}`, {
      method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
      let filterBoards = []
      filterBoards = boards.filter(board => board["_id"] != id)
      setBoards(filterBoards)
    })
    .catch(error => console.error(error));
  }

  return (
      <div style={{"backgroundColor": "#bbbbbb", "height": "100vh"}}>
        <h1 style={headerStyle}>Boards</h1>
        <div style={buttonGroup}>
          <Button variant="contained" onClick={() => setCreateBoard(!createBoard)}>Create Board</Button>
          <Button variant="contained">Add Item</Button>
        </div>
        <div style={tableContainer}>
          <TableContainer component={Paper} style={{"width": "800px"}}>
              <Table>
                  <TableBody>
                      {
                        boards.map((board, i) => (
                          <Row row={board} deleteBoard={deleteBoard} key={i}/>
                        ))
                      }
                  </TableBody>
              </Table>
          </TableContainer>
        </div>
        <Modal
          open={createBoard}
          onClose={() => setCreateBoard(!createBoard)}
        >
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">
              New Board
            </Typography>
            <TextField label="Display Name" variant="outlined" onChange={(e) => setDisplayNameInput(e.target.value)}/>
            <Button variant="contained" onClick={createNewBoard}>Create</Button>
          </Box>
        </Modal>
      </div>
  );
}
  
export default BoardManager;


const headerStyle = {
  "textAlign": "center", 
  "padding": "16px"
}

const tableContainer = {
  "display": "flex", 
  "padding": "0px 16px"
}

const buttonGroup = {
  "display": "flex", 
  "gap": "16px", 
  "padding": "16px"
}

const modalStyle = {
  position: 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};
