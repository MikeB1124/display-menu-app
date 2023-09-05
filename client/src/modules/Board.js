import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CardContent from '@mui/material/CardContent';
import ImageListItem from '@mui/material/ImageListItem';



function Card(props){
    const {item} = props
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
    const [slideIndex, setSlideIndex] = useState(window.localStorage.getItem("BOARD_INDEX") || 0)

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

    useEffect(() => {
        const environment = process.env.NODE_ENV || 'development';
        let websocketUrl = "ws://localhost:8080"
        if(environment == "production"){
            websocketUrl = `wss://${window.location.hostname}:${window.location.port}`
        }
        
        const ws = new WebSocket(`${websocketUrl}/api/ws`);

        ws.onmessage = (event) => {
            const message = event.data;
            // Handle the incoming message from the server
            console.log('Received:', message);
            window.location.reload(false)
        };

        return () => {
            // Clean up WebSocket connection on unmount if needed
            ws.close();
        };
    }, [])

    useEffect(() => {
        window.localStorage.setItem("BOARD_INDEX", slideIndex)
    }, [slideIndex])

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