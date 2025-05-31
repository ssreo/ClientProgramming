import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { app } from '../../firebase'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const WritePage = () => {
    const db = getFirestore(app);
    const navi = useNavigate();
    const [form, setForm] = useState({
        email: sessionStorage.getItem('email'),
        date: '',
        title: '',
        body: ''
    });
    const {title, body} = form;

    const onChangeForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    };

    const onSubmit = async(e) => {
        e.preventDefault();
        if(title === '' || body === '') {
            alert('제목과 내용을 입력하세요.');
        } else {
            const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            await addDoc(collection(db, 'post'), {...form, date});
            navi('/post');
        }
    }

    const onReset = (e) => {
        e.preventDefault();
        setForm({
            ...form,
            title: '',
            body: ''
        })
    };

    return (
        <div>
            <h1 className='my-5 text-center'>글쓰기</h1>
            <Row className='justify-content-center'>
                <Col md={8}>
                    <Form onSubmit={onSubmit}>
                        <Form.Control className='mb-1' 
                            name='title' value={title} onChange={onChangeForm} placeholder='제목을 입력하세요.'/>
                        <Form.Control as='textarea' rows={10} 
                            name='body' value={body} onChange={onChangeForm} placeholder='내용을 입력하세요.'/>
                        <div className='mt-3 text-center'>
                            <Button type='submit' className='px-5 mx-2'>등록</Button>
                            <Button type='reset' className='px-5' variant='secondary' onClick={onReset}>취소</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default WritePage
