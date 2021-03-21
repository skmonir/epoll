import { useState } from "react";
import { Container, Row, InputGroup, FormControl, Button, Col, Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from "react-router-dom";

const Home = () => {
    const [pollId, setPollId] = useState('');

    const history = useHistory();

    const takeMeToViewPoll = () => {
        history.push('/poll/' + pollId);
    };

    return (
        <Container style={{ minHeight: '450px' }}>
            {[1, 2, 3, 4, 5].map(() => <br />)}
            <Row className="justify-content-md-center">
                <Col xs={7}>
                    <InputGroup size="sm" className="mb-3">
                        <FormControl autoComplete={true} placeholder="Enter the poll id" value={pollId} onChange={(e) => setPollId(e.target.value)} />
                        <DropdownButton
                            as={InputGroup.Append}
                            variant="outline-secondary"
                            id="input-group-dropdown-2"
                            size="sm"
                        >
                            <Dropdown.Item href="#">Action</Dropdown.Item>
                            <Dropdown.Item href="#">Another action</Dropdown.Item>
                            <Dropdown.Item href="#">Something else here</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item href="#">Separated link</Dropdown.Item>
                        </DropdownButton>
                    </InputGroup>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Button variant="info" size="md" onClick={takeMeToViewPoll}>View Poll</Button>
            </Row>
        </Container>
    );
}

export default Home;