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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CardContent from '@mui/material/CardContent';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';



function Card(props){
    const {item} = props
    console.log(item)
    return(
        <>
            <div style={{"display": "flex", "alignItems": "center", "marginBottom": "62px"}}>
                <ImageListItem>
                    <img
                        style={{"width": "200px", "height": "200px"}}
                        src={item.imageURL}
                        alt={item.name}
                        loading="lazy"
                    />
                </ImageListItem>
                <CardContent>
                    <div style={{"display": "flex", "gap": "16px", "alignItems": "center"}}>
                        <Typography variant="h2" color="text.primary">
                            {item.name}
                        </Typography>
                        <Typography variant="h3" color="text.secondary">
                            {item.price}
                        </Typography>
                    </div>
                    <Typography variant="h5" component="div">
                        {item.description}
                    </Typography>
                </CardContent>
            </div>
        </>
    )
}

function Items(props){
    const {board} = props
    return(
        <>
            {
                board.items.map((item, i) => (
                    item.active ? (
                        <Card key={i} item={item}/>
                    ) : null
                ))
            }
        </>
    )
}


function Board() {
    const [boards, setBoards] = useState([])
    const [createdBoards, setCreatedBoards] = useState([])
    const [slideIndex, setSlideIndex] = useState(0)

    //Get boards
    useEffect(() => {
        fetch('/api/boards', {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            if (data.result != null){
                setBoards(data.result)
            }
        })
        .catch(error => console.error(error));
    }, [])

    function increaseIndex(){
        if(slideIndex < boards.length - 1){
            setSlideIndex(slideIndex + 1)
        }else{
            setSlideIndex(0)
        }
    }

    function decreaseIndex(){
        if(slideIndex > 0){
            setSlideIndex(slideIndex - 1)
        }else{
            setSlideIndex(boards.length - 1)
        }
    }

    return (
        <div style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}>
            <ArrowBackIosIcon onClick={decreaseIndex} style={{"cursor": "pointer"}}/>
            <div style={cardContainer}>
                {
                    boards.map((board, i) => (
                        <div key={i} hidden={slideIndex != i}>
                            <Items board={board}/>
                        </div>
                    ))
                }
            </div>
            <ArrowForwardIosIcon onClick={increaseIndex} style={{"cursor": "pointer"}}/>
        </div>
    );
}
  
export default Board;

const cardContainer = {
    "width": "90vw", 
    "height": "100vh", 
    "display": "flex", 
    "justifyContent": "center", 
    "alignItems": "center", 
    "flexDirection": "column", 
    "gap": "32px"
}