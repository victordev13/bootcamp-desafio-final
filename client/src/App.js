import React from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'api' });

export default function App() {
    const [transactions, setTransactions] = React.useState([]);

    React.useEffect(() => {
        const fetchTransactions = async () => {
            const { data } = await api.get('/transaction/?period=2020-02');
            console.log(data);

            setTransactions(data.transactions);
        };
        fetchTransactions();
    }, []);

    return (
        <div className="container">
            <h1 className="center">Desafio Final</h1>
            {transactions.map((transaction) => {
                return <p key={transaction._id}>{transaction.description}</p>;
            })}
        </div>
    );
}
