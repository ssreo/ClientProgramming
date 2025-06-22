import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize'
import { app } from '../../firebase'
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import moment from 'moment';
import CommentList from './CommentList';
import { useNavigate } from 'react-router-dom';

const CommentPage = ({id}) => {
    const navi = useNavigate();
    const db = getFirestore(app);
    const email = sessionStorage.getItem('email');
    const [contents, setContents] = useState('');
    
    const onSubmit = async() => {
        const comment = {
            pid: id,
            email,
            contents,
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        await addDoc(collection(db, 'comment'), comment);
        setContents('');
    };

    const onClickLogin = () => {
        sessionStorage.setItem('target', `/post/${id}`); 
        navi('/login');
    };

    return (
        <div className='my-4'>
            {email ?
                <Row className='justify-content-center'>
                    <Col md={10}>                        
                        <TextareaAutosize 
                            onChange={(e) => setContents(e.target.value)}
                            value={contents}
                            placeholder='내용을 입력하세요.'
                            className='textarea'/>
                        <Button
                            onClick={onSubmit} 
                            className='text-end px-5' 
                            disabled={contents === ''}>등록</Button>           
                    </Col>
                </Row>
                :
                <Row className='justify-content-center'>
                    <Col md={10}>
                        <Button onClick={onClickLogin}>로그인</Button>
                    </Col>
                </Row>
            }
            <CommentList pid={id}/>
        </div>
    )
}

export default CommentPage