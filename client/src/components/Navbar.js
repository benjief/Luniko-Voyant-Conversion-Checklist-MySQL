import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarToggler,
    Collapse
} from "reactstrap";
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
            light
        >
            <NavbarBrand href="/">
                <img className="test" src={require("../img/logo_exp.png")} alt="Luniko"></img>
            </NavbarBrand>
            {/* <NavbarToggler
                onClick={() => { setIsOpen(!isOpen) }}
                style={{ visibility: visibility }}
            /> */}
            {/* <Collapse navbar isOpen={isOpen}>
                <Nav
                    className="me-auto"
                    style={{ visibility: visibility }}
                    navbar>
                    <NavItem>
                        <NavLink
                            href={createRequestLink}
                            onMouseOver={(event) => { handleMouseOver(event.target) }}
                            onMouseLeave={(event) => { handleMouseLeave(event.target) }}>
                            Create
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            href={submittedRequestsLink}
                            className="sr-nav-link"
                            disabled={srDisabled}
                            onMouseOver={(event) => { handleMouseOver(event.target) }}
                            onMouseLeave={(event) => { handleMouseLeave(event.target) }}>
                            Submitted
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            href={ownedRequestsLink}
                            className="or-nav-link"
                            disabled={orDisabled}
                            onMouseOver={(event) => { handleMouseOver(event.target) }}
                            onMouseLeave={(event) => { handleMouseLeave(event.target) }}>
                            Owned
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            onClick={logout}
                            onMouseOver={(event) => { handleMouseOver(event.target) }}
                            onMouseLeave={(event) => { handleMouseLeave(event.target) }}>
                            Logout
                        </NavLink>
                    </NavItem>
                </Nav>
            </Collapse> */}
        </Navbar >
    );
}

export default NavBar;