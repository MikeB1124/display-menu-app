import { Outlet, Link } from "react-router-dom";

function Home() {
    return (
        <div style={{"padding": "32px"}}>
            <h1 style={header}>Trimana Apps</h1>
            <div style={moduleContainer}>
                <div style={appcontainer}>
                    <Link to="/boards">Special Boards</Link>
                </div>
                <div style={appcontainer}>
                    <Link to="/boardmanager">Board Manager</Link>
                </div>
            </div>
        </div>
    );
}
  
export default Home;
  
const header = {
    "textAlign": "center"
}

const moduleContainer = {
    "display": "flex",
    "gap": "16px"
}

const appcontainer = {
    "display": "flex",
    "justifyContent": "center",
    "alignItems": "center",
    "border": "3px solid black",
    "width": "150px",
    "height": "150px"
}