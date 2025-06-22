import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getFirestore, collection, query, orderBy, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { Button, Col, Form, Row } from 'react-bootstrap';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import TextareaAutosize from 'react-textarea-autosize'

const CommentList = ({pid}) => {
    const db = getFirestore(app);
    const [list, setList] = useState([]);
    const email = sessionStorage.getItem('email');

    const getList = () => {
        const q = query(collection(db, 'comment'), 
                        where('pid', '==', pid),
                        orderBy('date', 'desc'));

        onSnapshot(q, snapshot => {
            let rows = [];

            snapshot.forEach(row => {
                rows.push({...row.data(), id: row.id,});
            });

            const data = rows.map(row =>
                row && {...row, ellipsis: true, edit: false, text: row.contents}
            );

            setList(data);
        });
    };

    const onClickComment = (id) => {
        const data = list.map(comment => 
            comment.id === id ? 
            {...comment, ellipsis: !comment.ellipsis} : comment
        );

        setList(data);        
    };

    const onClickUpdate = (id) => {
        const data = list.map(comment => 
            comment.id === id ? 
            {...comment, edit: !comment.edit} : comment);
        
        setList(data);
    };

    const onChangeComment = (id, e)=> {
        const data = list.map(comment => 
            comment.id === id ? 
            {...comment, contents: e.target.value} : comment);

        setList(data);
    };

    const onClickCancel = (c) => {
        const data = list.map(comment => 
            comment.id === c.id ? 
            {...comment, edit: false, contents: comment.text} : comment);

        setList(data);
    };

    const onClickSave = (c) => {
        const data = list.map(comment => 
            comment.id === c.id ? 
            {...comment, edit: false} : comment);

        setList(data);
        updateDoc(doc(db, 'comment', c.id), c);
    };

    const onClickDelete = async(id) => {
    const target = list.find(comment => comment.id === id);
    if (window.confirm(`작성자 ${target?.email}님의 댓글을 삭제하시겠습니까?`)) {
        await deleteDoc(doc(db, 'comment', id));
    }
};

    useEffect(() => {
        getList();
    }, []);

    return (
        <Row className='justify-content-center mt-2'>
            <Col md={10}>
                {list.map(comment =>
                    <div key={comment.id} className='my-3'>
                        <Row>
                            <Col className='text-muted'>
                                {comment.date } | { comment.email}
                            </Col>
                            {comment.email === email && !comment.edit &&
                                <Col className='text-end'>
                                    <CiEdit onClick={() => onClickUpdate(comment.id)} className='edit'/>
                                    <MdDeleteOutline onClick={() => onClickDelete(comment.id)} className='delete ms-1'/>
                                </Col>
                            }
                        </Row>
                        {comment.edit ? 
                            <Form>
                                <TextareaAutosize className='textarea'
                                    onChange={(e) => onChangeComment(comment.id, e)}
                                    value={comment.contents}/>  
                                <div className='text-end'>
                                    <Button onClick={() => onClickSave(comment)}
                                        size='sm' variant='primary' className='mx-1' 
                                        disabled={comment.text === comment.contents}>저장</Button>
                                    <Button onClick={() => onClickCancel(comment)} 
                                        size='sm' variant='secondary'>취소</Button>
                                </div>      
                            </Form>
                            :
                            <div 
                                style={{cursor:'pointer'}}
                                onClick={() => onClickComment(comment.id)}                                
                                className={comment.ellipsis ? 'ellipsis' : ''}>
                                    <p style={{whiteSpace:'pre-wrap'}}>{comment.contents}</p>
                            </div>
                        }
                    </div>
                )}
            </Col>
        </Row>
    )
}

export default CommentList