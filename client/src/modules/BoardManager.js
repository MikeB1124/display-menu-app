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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

function BasicSelect(props) {
  const {boards, selectedBoard, setSelectedBoard} = props

  const handleChange = (event) => {
    setSelectedBoard(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>Select Board</InputLabel>
        <Select
          value={selectedBoard}
          label="Board"
          onChange={handleChange}
        >
          {
            boards.map((board, i) => (
              <MenuItem key={i} value={board}>{board.displayName}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );
}

function AddItemModal(props) {
  const {board, addItemModal, setAddItemModal, items, setItems} = props
  const [displayNameInput, setDisplayNameInput] = useState("")
  const [descriptionInput, setDescriptionInput] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrlInput, setImageUrlInput] = useState("")

  function addNewItem(){
    let newItem = {
      "name": displayNameInput,
      "description": descriptionInput,
      "price": price,
      "imageURL": imageUrlInput,
      "active": true
    }
    fetch(`/api/menuItems/${board["_id"]}`, {
      method: "PATCH",
      body: JSON.stringify(newItem)
    })
    .then(response => response.json())
    .then(data => {
      newItem["_id"] = data.id
      let updateArray = []
      items.map(item => {
        updateArray.push(item)
      })
      updateArray.push(newItem)
      setItems(updateArray)
      setAddItemModal(false)
    })
    .catch(error => console.error(error));
  }

  return(
    <Modal
      open={addItemModal}
      onClose={() => setAddItemModal(!addItemModal)}
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" textAlign={"center"}>
          Add Item to {board.displayName}
        </Typography>
        <TextField label="Item Name" variant="outlined" onChange={(e) => setDisplayNameInput(e.target.value)}/>
        <TextField label="Description" variant="outlined" onChange={(e) => setDescriptionInput(e.target.value)}/>
        <TextField label="Price" variant="outlined" onChange={(e) => setPrice(e.target.value)}/>
        <TextField label="Image URL" variant="outlined" onChange={(e) => setImageUrlInput(e.target.value)}/>
        <Button variant="contained" onClick={addNewItem}>Add Item</Button>
      </Box>
    </Modal>
  )
}



function CreateBoardModal(props) {
  const {boards, setBoards, createBoardModal, setCreateBoardModal} = props
  const [displayNameInput, setDisplayNameInput] = useState("")

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
      setCreateBoardModal(false)
    })
    .catch(error => console.error(error));
  }

  return(
    <Modal
      open={createBoardModal}
      onClose={() => setCreateBoardModal(!createBoardModal)}
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          New Board
        </Typography>
        <TextField label="Display Name" variant="outlined" onChange={(e) => setDisplayNameInput(e.target.value)}/>
        <Button variant="contained" onClick={createNewBoard}>Create</Button>
      </Box>
    </Modal>
  )
}

function SwitchButton(props) {
  const {item} = props
  const [switchOpen, setSwitchOpen] = useState(item.active)

  function toggleSwitch() {
    fetch(`/api/menuItems/active/${item["_id"]}/${!switchOpen}`, {
      method: "PATCH",
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setSwitchOpen(!switchOpen)
    })
    .catch(error => console.error(error));
  }
  return (
    <>
      <Switch checked={switchOpen} onClick={toggleSwitch}/>
    </>
  )
}

function RemoveButton(props) {
  const {deletedItem, items, setItems} = props

  function removeItem() {
    fetch(`/api/menuItems/remove/${deletedItem["_id"]}`, {
      method: "PATCH",
    })
    .then(response => response.json())
    .then(data => {
      let filterItems = []
      filterItems = items.filter(item => item["_id"] != deletedItem["_id"])
      setItems(filterItems)
    })
    .catch(error => console.error(error));
  }
  return (
    <>
      <Button variant='contained' color="error" onClick={removeItem}>Delete</Button>
    </>
  )
}

function Row(props) {
    const { row, boards, setBoards } = props;
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([])
    const [addItemModal, setAddItemModal] = useState(false)

    useEffect(() => {
      setItems(row.items)
    }, [])

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
              <Button variant="contained" onClick={() => setAddItemModal(!addItemModal)}>Add Item</Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {
                  items.map((item, i) => (
                    <div style={{"display": "flex", "gap": "32px", "marginBottom": "8px"}} key={i}>
                      <Typography variant="h6">{item.name}</Typography> 
                      <Typography variant="h6">${item.price}</Typography> 
                      <SwitchButton item={item}/>
                      <RemoveButton deletedItem={item} items={items}  setItems={setItems}/>
                    </div>
                  ))
                }
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <AddItemModal 
          board={row}
          items={items}
          setItems={setItems}
          addItemModal={addItemModal} 
          setAddItemModal={setAddItemModal}
        />
      </>
    );
}



function BoardManager() {
  const [boards, setBoards] = useState([])
  const [createBoardModal, setCreateBoardModal] = useState(false)

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


  return (
      <div style={{"backgroundColor": "#bbbbbb", "height": "100vh"}}>
        <h1 style={headerStyle}>Boards</h1>
        <div style={buttonGroup}>
          <Button variant="contained" onClick={() => setCreateBoardModal(!createBoardModal)}>Create Board</Button>
        </div>
        <div style={tableContainer}>
          <TableContainer component={Paper} style={{"width": "800px"}}>
              <Table>
                  <TableBody>
                      {
                        boards.map((board, i) => (
                          <Row row={board} boards={boards} setBoards={setBoards} key={i}/>
                        ))
                      }
                  </TableBody>
              </Table>
          </TableContainer>
        </div>
        <CreateBoardModal 
          boards={boards} 
          setBoards={setBoards} 
          createBoardModal={createBoardModal} 
          setCreateBoardModal={setCreateBoardModal}
        />
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
