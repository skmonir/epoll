import { Link } from 'react-router-dom'
import { Container, Navbar, Nav } from "react-bootstrap";

const Header = () => {
    return (
        // <Container fluid>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand>e-poll</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link><Link to="/">Home</Link></Nav.Link>
                        <Nav.Link><Link to="/create">Create</Link></Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link>About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        // </Container>
    );
}
 
export default Header;