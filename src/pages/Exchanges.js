import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Exchange = () => {
    const [exchange, setExchange] = useState(null);
    const [exchanges, setExchanges] = useState([]);
    const [title, setTitle] = useState('');
    const [owner, setOwner] = useState('');
    const [loanDate, setLoanDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [username, setUsername] = useState(''); // Nombre del usuario logueado
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
              const response = await fetch('http://localhost:5000/exchange/me', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
          
              if (!response.ok) {
                throw new Error('Error fetching user');
              }
          
              const data = await response.json();
              setUsername(data.username); // Suponiendo que la respuesta contiene un campo 'username'
            } catch (error) {
              console.error('Error fetching user:', error);
            }
          };
                 

        fetchUser();
    }, []);

    const fetchExchanges = async () => {
        try {
            const response = await fetch('http://localhost:5000/exchange/exchange', {
                method: 'POST', // Cambiado a POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de que el token esté almacenado
                }
            });
            if (!response.ok) {
                throw new Error('Error fetching exchanges');
            }
            const data = await response.json();
            setExchanges(data);
        } catch (error) {
            console.error('Error fetching exchanges:', error);
        }
    };

    const fetchExchangeById = async (exchangeId) => {
        try {
            const response = await fetch('http://localhost:5000/exchange/getExchange', {
                method: 'POST', // Cambiado a POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de que el token esté almacenado
                },
                body: JSON.stringify({ id: exchangeId })
            });
            if (!response.ok) {
                throw new Error('Error fetching exchange details');
            }
            const data = await response.json();
            setExchange(data);
        } catch (error) {
            console.error('Error fetching exchange details:', error);
        }
    };

    const requestBook = async (e) => {
        e.preventDefault();
        if (title.trim() && owner.trim() && loanDate.trim() && returnDate.trim()) {
            try {
                const response = await fetch('http://localhost:5000/exchange/createExchange', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de que el token esté almacenado
                    },
                    body: JSON.stringify({
                        owner: owner,
                        title: title,
                        loanDate: loanDate,
                        returnDate: returnDate,
                        requester: username // Asegúrate de que 'username' se esté usando aquí
                    }),
                });
                if (response.ok) {
                    fetchExchanges();
                    setTitle('');
                    setOwner('');
                    setLoanDate('');
                    setReturnDate('');
                } else {
                    const errorData = await response.json();
                    console.error('Error requesting book:', errorData.error);
                }
            } catch (error) {
                console.error('Error requesting book:', error);
            }
        }
    };

    const viewDetails = (exchangeId) => {
        navigate(`/exchanges/${exchangeId}`);
    };

    useEffect(() => {
        if (id) {
            fetchExchangeById(id);
        } else {
            fetchExchanges();
        }
    }, [id]);

    return (
        <div>
            {!id && (
                <>
                    <form onSubmit={requestBook} style={formStyle}>
                        <h2>Request a Book</h2>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Book Title"
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            placeholder="Owner"
                            style={inputStyle}
                        />
                        <label style={labelStyle}>Loan Date</label>
                        <input
                            type="date"
                            value={loanDate}
                            onChange={(e) => setLoanDate(e.target.value)}
                            style={inputStyle}
                        />
                        <label style={labelStyle}>Return Date</label>
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            style={inputStyle}
                        />
                        <button type="submit" style={buttonStyle}>Request Book</button>
                    </form>

                    <h2>List of Exchanges</h2>
                    <ul style={listStyle}>
                        {exchanges.length > 0 ? (
                            exchanges.map(exchange => (
                                <li key={exchange._id} style={listItemStyle}>
                                    <span>{`Book: ${exchange.title}`}</span>
                                    <button onClick={() => viewDetails(exchange._id)}>View Details</button>
                                </li>
                            ))
                        ) : (
                            <li style={listItemStyle}>No exchanges available.</li>
                        )}
                    </ul>
                </>
            )}

            {id && exchange && (
                <div>
                    <h1>Exchange Details</h1>
                    <p><strong>Book:</strong> {exchange.title}</p>
                    <p><strong>Owner:</strong> {exchange.owner}</p>
                    <p><strong>Status:</strong> {exchange.status}</p>
                </div>
            )}
        </div>
    );
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
};

const inputStyle = {
    margin: '10px 0',
    padding: '10px',
    fontSize: '16px'
};

const labelStyle = {
    marginTop: '10px',
    fontSize: '14px',
    color: '#555',
};

const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
};

const listStyle = {
    marginTop: '20px',
    listStyleType: 'none',
    padding: '0',
    width: '300px',
    margin: 'auto'
};

const listItemStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd'
};

export default Exchange;