import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const BookPage = ({book}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <img src={book.thumbnail || 'https://placehold.co/100x150'} 
                width='100%'
                onClick={handleShow}
                style={{'cursor': 'pointer'}}/>

            <Modal
                size='lg'
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>도서정보</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xl={3}>
                            <img src={book.thumbnail || 'https://placehold.co/100x150'} 
                                width='100%'/>
                        </Col>
                        <Col className='align-self-center'>
                            <h5>{book.title}</h5>
                            <div>판매가: {book.sale_price}원</div>
                            <div>출판사: {book.publisher}</div>
                            <div>ISBN: {book.isbn}</div>
                            <div>출판일: {book.datetime}</div>
                        </Col>
                    </Row>
                    <hr/>
                    <div>{book.contents || '내용없음'}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BookPage
