import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'



function LoadingPage(){
    return(
        <Box style={loaderStyle}>
            <CircularProgress/>
        </Box>
    )
}

export default LoadingPage

const loaderStyle = {
    width:'100vw', 
    display:'flex', 
    justifyContent:'center', 
    alignItems: 'center',
    height: "100vh"
}