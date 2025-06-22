import React, { useEffect, useState } from 'react'
import { data, useNavigate, useParams } from 'react-router-dom'
import { app } from '../../firebase'
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { Button, Card, Col, Row } from 'react-bootstrap'
import CommentPage from './CommentPage'

const ReadPage = () => {
    const navi = useNavigate();
    const login = sessionStorage.getItem('email');
    const [loading, setLoading] = useState(false);
    const db = getFirestore(app);
    const params = useParams();
    const {id} = params;
    const [post, setPost] = useState({
        id: '',
        title: '',
        body: '',
        date: '',
        email: ''
    });
    const {title, body, date, email} = post;

    const getPost = async() => {
        setLoading(true);
        const snapshot = await getDoc(doc(db, 'post', id));

        setPost(snapshot.data());
        setLoading(false);
    }

    const onDelete = async () => {
    const postRef = doc(db, 'post', id);
    const postSnap = await getDoc(postRef);
    const postData = postSnap.exists() ? postSnap.data() : null;

    const author = postData?.email || '작성자';
    const confirmMsg = `${author}님의 게시글을 삭제하시겠습니까?`;

    if (window.confirm(confirmMsg)) {
        await deleteDoc(postRef);
        navi(-1);
    }
};

    useEffect(() => {
        getPost();
    }, []);

    if(loading) return <h1 className='text-center my-5'>Loading...</h1>

    return (
        <div>
            <h1 className='text-center my-5'>게시글 정보</h1>
            {login === email && 
                <Row className='justify-content-center mb-1'>
                    <Col md={10} className='text-end'>
                        <Button size='sm' 
                            onClick={() => navi(`/post/update/${id}`)}
                            variant='outline-success' className='mx-1'>수정</Button>
                        <Button size='sm' 
                            onClick={onDelete}
                            variant='outline-danger'>삭제</Button>
                    </Col>
                </Row>
            }
            <Row className='justify-content-center'>
                <Col md={10}>
                    <Card>
                        <Card.Body>
                            <h5>{title}</h5>
                            <hr/>
                            <p style={{whiteSpace: 'pre-wrap'}}>{body}</p>
                        </Card.Body>
                        <Card.Footer>
                            Posted on {date} by {email}
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            <CommentPage id={id}/>
        </div>
    )
}

export default ReadPage