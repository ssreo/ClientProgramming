import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getFirestore, collection, query, orderBy, where, onSnapshot } from 'firebase/firestore'
import { Col, Row } from 'react-bootstrap';

const CommentList = ({pid}) => {
    const db = getFirestore(app);
    const [list, setList] = useState([]);

    const getList = () => {
        const q = query(collection(db, 'comment'), 
                        where('pid', '==', pid),
                        orderBy('date', 'desc'));

        onSnapshot(q, snapshot => {
            let rows = [];
            snapshot.forEach(row => {
                rows.push({id: row.id, ...row.data()});
            });            

            setList(rows);
        });
    };

    useEffect(() => {
        getList();
    }, []);

    return (
        <Row className='justify-content-center mt-3'>
            <Col md={10}>
                {list.map(comment => 
                    <div key={comment.id}>
                        <div>
                            {comment.date} | {comment.email}
                        </div>
                        <div>
                            <p style={{whiteSpace: 'pre-wrap'}}>{comment.contents}</p>
                        </div>
                    </div>
                )}
            </Col>
        </Row>
    )
}

export default CommentList