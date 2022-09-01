import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "reactstrap";
import "../styles/Navbar.css";

/**
 * Just a very simplified version of reactstrap's navbar, which can be found here: https://6-4-0--reactstrap.netlify.app/components/navbar/.
 * @returns said navbar.
 */
function NavBar() {
    return (
        <Navbar
            dark
            expand="md"
            fixed=""
            light>
            <Link to={'/'}>
                <img src={require("../img/logo_exp.png")} alt="Luniko"></img>
            </Link>
        </Navbar >
    );
}

export default NavBar;
