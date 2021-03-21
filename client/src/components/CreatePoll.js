import { useState } from "react";
import {
    Container, Row, Col, InputGroup, FormControl, Button, Form, Toast
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const CreatePoll = ({ userService }) => {
    const [pollOptions, setPollOptions] = useState([]);
    const [newPollOption, setNewPollOption] = useState('');
    const [newPollTitle, setNewPollTitle] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const history = useHistory();


    const addOptionToThePoll = (e) => {
        e.preventDefault();

        setNewPollOption(newPollOption.trim());

        if (newPollOption === '') {
            showToastMessage('Option can not be empty.');
        } else if (hasDuplicatePollOption()) {
            showToastMessage('Can not add duplicate option.');
        } else {
            setPollOptions([...pollOptions, newPollOption]);
            setNewPollOption('');
        }
    };

    const removeOptionFromThePoll = (removeId) => {
        let modifiedOptions = [...pollOptions];
        modifiedOptions.splice(removeId, 1);
        setPollOptions(modifiedOptions);
    };

    const modifyPollOption = (id, newValue) => {
        let modifiedOptions = [...pollOptions];
        modifiedOptions[id] = newValue;
        setPollOptions(modifiedOptions);
    };

    const createPoll = () => {
        if (validatePollBeforeSaving()) {
            let poll = getNewPollToSaveIntoDB();
            savePollIntoDB(poll);
        }
    };

    const savePollIntoDB = (poll) => {
        fetch('http://localhost:8000/api/v1/createNewPoll', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(poll)
        }).then(response => {
            if (!response.ok || response.message) {
                throw Error();
            }
            return response.json();
        }).then(response => {
            updateNewPollIntoSiteData(response.id);
            history.push('/poll/' + response.id);
        }).catch(err => {
            showToastMessage('Something wrong while saving poll.');
        })
    };

    const getNewPollToSaveIntoDB = () => {
        let voteCnt = {};
        pollOptions.forEach(option => {
            voteCnt[option] = 0;
        });
        let siteData = userService.getSiteData();
        let poll = {
            id: "",
            owner: siteData.uid,
            active: true,
            title: newPollTitle,
            options: pollOptions,
            votes: {},
            vote_count: voteCnt
        }

        return poll;
    };

    const validatePollBeforeSaving = () => {
        let isValid = true;
        if (!newPollTitle || newPollTitle === '') {
            isValid = false;
            showToastMessage('Poll title can not be empty.');
        } else if (!pollOptions || pollOptions.length < 2) {
            isValid = false;
            showToastMessage('At least two poll option is needed.');
        }

        return isValid;
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const hasDuplicatePollOption = () => {
        let duplicatePollIndex = pollOptions.findIndex(option => option === newPollOption);
        return duplicatePollIndex !== -1;
    };

    const updateNewPollIntoSiteData = (pollId) => {
        let siteData = userService.getSiteData();
        siteData.host.push(pollId);
        userService.updateSiteData(siteData);
    };

    return (
        <Container>
            <div>
                <Toast style={{ position: 'absolute', top: 60, right: 20 }} onClose={() => setShowToast(false)} show={showToast} delay={4000} autohide>
                    <Toast.Header>
                        <strong className="mr-auto">Message</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>

            {/* <div className="panel" style={{minHeight:'450px'}}>
                <div className="panel-body"> */}
            <Row className="justify-content-md-center" style={{ minHeight: '450px' }}>
                <Col xs lg="8">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="panel-title">
                                <h1>Create Poll</h1>
                            </div>
                        </div>
                        <div className="panel-body">
                            <InputGroup className="mb-3">
                                <FormControl placeholder="Enter the poll title here" value={newPollTitle} onChange={(e) => setNewPollTitle(e.target.value)} />
                            </InputGroup>
                            {
                                pollOptions.map((option, idx) => (
                                    <InputGroup size="sm" className="mb-3" key={idx}>
                                        <FormControl value={option} onChange={(e) => modifyPollOption(idx, e.target.value)} />
                                        <InputGroup.Append>
                                            <Button variant="danger" onClick={() => removeOptionFromThePoll(idx)}><FontAwesomeIcon icon={faTrashAlt} /></Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                ))
                            }
                            <hr />
                            <Form onSubmit={addOptionToThePoll}>
                                <InputGroup size="sm" className="mb-3">
                                    <FormControl placeholder="Add your option" value={newPollOption} onChange={(e) => setNewPollOption(e.target.value)} />
                                    <InputGroup.Append>
                                        <Button variant="outline-success" onClick={addOptionToThePoll}><FontAwesomeIcon icon={faPlus} /></Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form>
                            <Button variant="primary" size="md" block onClick={createPoll}><FontAwesomeIcon icon={faSave} /> Save</Button>
                        </div>
                    </div>
                </Col>
            </Row>
            {/* </div>
            </div> */}
        </Container>
    );
}

export default CreatePoll;