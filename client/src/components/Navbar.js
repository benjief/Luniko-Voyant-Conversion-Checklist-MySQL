// import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "reactstrap";
import "../styles/Navbar.css";

function NavBar() {
    // const [isOpen, setIsOpen] = useState(false);

    // function handleMouseOver(target) {
    //     if (!target.disabled) {
    //         target.style.setProperty("color", "var(--lunikoOrange)", "important");
    //     }
    // }

    // function handleMouseLeave(target) {
    //     if (!target.disabled) {
    //         target.style.setProperty("color", "white", "important");
    //     }
    // }

    // Manipulating DOM elements directly isn't encouraged, but I don't have a choice here
    // useEffect(() => {
    //     setSRAndORStatus();
    // });

    return (
        <Navbar
            dark
            expand="md"
            fixed=""
            light>
            <Link to={'/'}>
                {/* <NavbarBrand> */}
                <img src={require("../img/logo_exp.png")} alt="Luniko"></img>
                {/* </NavbarBrand> */}
            </Link>
        </Navbar >
    );
}

export default NavBar;