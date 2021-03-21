import { useEffect, useState } from "react";
import {
    Container, Row, Col, InputGroup, FormControl, Toast, Alert, Form
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const ViewPoll = ({ userService }) => {
    const [optionDetail, setOptionDetail] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [pollTitle, setPollTitle] = useState('');
    const [originalPoll, setOriginalPoll] = useState({});
    const [epollSiteData, setEpollSiteData] = useState({});

    const { id } = useParams();

    useEffect(() => {
        let siteData = userService.getSiteData();
        setEpollSiteData(siteData);
        getPollDetail();
    }, []);

    const initSocketConnection = () => {
        if (window["WebSocket"]) {
            let conn = new WebSocket("ws://localhost:8000/api/v1/ws");
            conn.onclose = function (evt) {
                console.log('Socket Connection Closed!');
            };
            conn.onopen = function (evt) {
                console.log('Opened')
                conn.send(id);
            }
            conn.onmessage = function (evt) {
                let data = JSON.parse(evt.data);
                processPollToView(data);
                console.log('from socket', data);
            };
        }
    };

    const getPollDetail = () => {
        fetch('http://localhost:8000/api/v1/getPoll/' + id
        ).then(response => {
            if (!response.ok) {
                throw Error();
            }
            return response.json();
        }).then(response => {
            initSocketConnection();
            processPollToView(response);
        }).catch(err => {
            showToastMessage('Something wrong while fetching poll.');
        })
    }

    const updateNewSelectedOptionIntoSiteData = (selectedOption, deltaOffset) => {
        let currentSiteData = { ...epollSiteData };
        currentSiteData.votes[id] = (deltaOffset === 1 ? selectedOption : '');

        userService.updateSiteData(currentSiteData);
        setEpollSiteData(currentSiteData);
    };

    const processPollToView = (poll) => {
        setOriginalPoll(poll);

        let optDetail = [];
        let totalVote = 0;
        for (const [optionLabel, optionCount] of Object.entries(poll.vote_count)) {
            optDetail.push({
                optionLabel: optionLabel,
                count: optionCount,
                parcentage: 0
            });
            totalVote += optionCount;
        }

        if (totalVote > 0) {
            optDetail.forEach(option => {
                let percentage = (option.count / totalVote) * 100.0;
                option.parcentage = Math.round((percentage + Number.EPSILON) * 10) / 10;
            });
        }

        setPollTitle(poll.title);
        setOptionDetail(optDetail);
    };

    const submitVote = (selectedOption, voteStatus) => {
        let deltaOffset = voteStatus ? 1 : -1;
        let pollToSave = processPollToSave(selectedOption, deltaOffset);
        updatePoll(pollToSave, selectedOption, deltaOffset);
    }

    const processPollToSave = (selectedOption, deltaOffset) => {
        let newVoteCount = { ...originalPoll.vote_count };
        newVoteCount[selectedOption] = newVoteCount[selectedOption] + deltaOffset;

        let pollToSave = {
            id: originalPoll.id,
            uid: epollSiteData.uid,
            vote_count: newVoteCount,
            my_vote: deltaOffset == 1 ? selectedOption : ''
        };

        return pollToSave;
    }

    const updatePoll = (poll, selectedOption, deltaOffset) => {
        fetch('http://localhost:8000/api/v1/updatePoll', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(poll)
        }).then(response => {
            if (!response.ok || response.message) {
                throw Error();
            }
            return response.json();
        }).then(response => {
            // getPollDetail();
            updateNewSelectedOptionIntoSiteData(selectedOption, deltaOffset);
        }).catch(err => {
            showToastMessage('Something wrong while updating poll.');
        })
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
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

            <Row className="justify-content-md-center" style={{ minHeight: '450px' }}>
                <Col xs lg="8">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="panel-title">
                                <h1>{pollTitle}</h1>
                            </div>
                        </div>
                        <div className="panel-body">
                            {
                                optionDetail.map((option, idx) => (
                                    <InputGroup size="sm" className="mb-3" key={idx}>
                                        <InputGroup.Prepend>
                                            <InputGroup.Checkbox
                                                checked={epollSiteData.votes[id] === option.optionLabel}
                                                disabled={epollSiteData.votes[id] && epollSiteData.votes[id] !== option.optionLabel}
                                                onChange={(e) => submitVote(option.optionLabel, e.target.checked)} />
                                        </InputGroup.Prepend>
                                        <FormControl value={option.optionLabel} disabled={true} />
                                        <InputGroup.Append>
                                            <InputGroup.Text>{option.parcentage}%</InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                ))
                            }
                            <hr />
                            {
                                epollSiteData.votes && epollSiteData.votes[id] &&
                                <Form.Text className="text-muted" style={{ textAlign: 'center' }}>
                                    If you want to select another option, please deselect current option first.
                                        </Form.Text>
                                // <Alert variant="info" style={{textAlign: 'center'}}>
                                //     If you want to select another option, please deselect current option first.
                                // </Alert>
                            }
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ViewPoll;