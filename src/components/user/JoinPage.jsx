import React, { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { app } from '../../firebase'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const JoinPage = () => {
    const auth = getAuth(app);
    const navi = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: 'green@inha.ac.kr',
        password: '12341234'
    });
    const {email, password} = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if(email === '' || password === '') {
            alert('이메일 혹은 패스워드를 입력하세요.');
        } else {
            if(window.confirm('회원가입 하시겠습니까?')) {
                setLoading(true);
                createUserWithEmailAndPassword(auth, email, password)
                .then(success => {
                    setLoading(false);
                    alert('회원가입 완료');
                    navi('/login');
                })
                .catch(error => {
                    setLoading(false);
                    alert('회원가입 실패 : ' + error.message);
                });
            }
        }
    };

    if(loading) return <h1 className='my-5 text-center'>Loading...</h1>
    
    return (
        <div>
            <Row className='my-5 justify-content-center'>
                <Col lg={4} md={6} xs={8}>
                    <Card>
                        <Card.Header>
                            <h5>회원가입</h5>                            
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={onSubmit}>
                                <Form.Control className='mb-2'
                                    value={email} name='email'
                                    onChange={onChange}/>
                                <Form.Control className='mb-2' type='password'
                                    value={password} name='password'
                                    onChange={onChange}/>
                                <Button className='w-100' type='submit'>회원가입</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default JoinPage
