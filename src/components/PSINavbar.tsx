
import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router";
import "bootstrap/dist/js/bootstrap.bundle.js"

export default function PSINavbar() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => {
        setIsNavCollapsed(!isNavCollapsed)
    };

    return (
        <Navbar expand="lg" bg="primary" data-bs-theme="dark">
            <Container fluid>
                <Navbar.Brand href="#home">ENGTRIAL Insight</Navbar.Brand>
                <button onClick={handleNavCollapse} className={`navbar-toggler ${isNavCollapsed ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="navbarSupportedContent">
                    <Nav className="me-auto">
                        <Nav.Item>
                            <NavLink to="/dashboard" onClick={handleNavCollapse} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Home
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink to="/dashboard/about" onClick={handleNavCollapse} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                About
                            </NavLink>
                        </Nav.Item>

                    </Nav>
                </div>
            </Container>
        </Navbar>
    )
}