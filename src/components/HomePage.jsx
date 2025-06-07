import axios from 'axios';
import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import BookPage from './BookPage';
import { BsCart2 } from 'react-icons/bs';
import { app } from '../firebase'
import { getDatabase, ref, get, set, onValue, remove } from 'firebase/database'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";

const HomePage = () => {
    const navi = useNavigate();
    const apiKey=process.env.REACT_APP_KAKAO_REST_KEY;
    const db = getDatabase(app);
    const [heart, setHeart] = useState([]); 
    const [loading, setLoading] = useState(false);
    const uid = sessionStorage.getItem('uid');
    const [documents, setDocuments] = useState([]);
    const [query, setQuery] = useState('react');
    const [page, setPage] = useState(1);
    const [last, setLast] = useState(1);

    const callAPI = async () => {
        const url = "https://dapi.kakao.com/v3/search/book?target=title";
        const config = {
            headers: {
                Authorization: "KakaoAK 79c9b070ed254c423c123706870a712e"
            },
            params: {
                query: query,
                size: 12,
                page: page
            }
        }
        const res = await axios.get(url, config);
        setDocuments(res.data.documents);
        setLast(Math.ceil(res.data.meta.pageable_count / 12));
    };

    useEffect(() => {
        callAPI();
    }, [page])

    const onSubmit = (e) => {
        e.preventDefault();
        
        if(query === '') {
            alert("검색어를 입력하세요.");
        } else {
            setPage(1);
            callAPI();
        }
    };


    const onClickCart = (book) => {
        if(uid) {
            get(ref(db, `cart/${uid}/${book.isbn}`))
            .then(snapshot => {
                if(snapshot.exists()) {
                    alert('이미 장바구니에 존재합니다.');
                } else {
                    const date = moment(new Date()).format('YYYY-MM-DD HH:mm-ss');
                    set(ref(db, `cart/${uid}/${book.isbn}`), {...book, date});
                    alert('장바구니에 추가되었습니다!');
                }
            });
        } else {
            navi('/login');
        }
    }

    const onClickHeart = (book) => {
        remove(ref(db, `heart/${uid}/${book.isbn}`));
        alert('즐겨찾기가 취소되었습니다.')
    }

    const onClickRegHeart = (book) => {
        if(uid) {
            set(ref(db, `heart/${uid}/${book.isbn}`), book);
            alert('즐겨찾기에 등록되었습니다.');
        } else {
            navi('/login');
        }
    }

    const checkHeart = () => {
        setLoading(true);
        onValue(ref(db, `heart/${uid}`), snapshot => {
            const rows = [];
            snapshot.forEach(row => {
                rows.push(row.val().isbn);
            });

            setHeart(rows);
            setLoading(false);
        });
    }

    useEffect(() => {
        checkHeart();
    }, []);

    if(loading) return <h1 className='my-5 text-center'>Loading...</h1>

    return (
        <div>
            <h1 className='my-5 text-center'>HomePage</h1>
            <Row className='mb-2'>
                <Col>
                    <Form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </Form>
                </Col>
                <Col></Col>
                <Col></Col>
            </Row>
            <Row>
                {documents.map(doc =>
                    <Col lg={2} md={3} xs={6} className='mb-2' key={doc.isbn}>
                        <Card>
                            <Card.Body>                            
                                <BookPage book={doc}/>
                                <div className='heart text-end'>
                                    {heart.includes(doc.isbn) ? 
                                        <FaHeart onClick={() => onClickHeart(doc)}/>
                                        :
                                        <FaRegHeart onClick={() => onClickRegHeart(doc)}/>
                                    }
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <div className='text-truncate'>{doc.title}</div>
                                <Row>
                                    <Col>{doc.sale_price}원</Col>
                                    <Col className='text-end cart'>
                                        <BsCart2 onClick={() => onClickCart(doc)}/>
                                    </Col>
                                </Row>                            
                            </Card.Footer>
                        </Card>                        
                    </Col>
                )}
            </Row>
            <div className='text-center mt-3'>
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>이전</Button>
                <span className='mx-3'>{page} / {last}</span>
                <Button onClick={() => setPage(page + 1)} disabled={page === last}>다음</Button>
            </div>
        </div>
    )
}

export default HomePage
