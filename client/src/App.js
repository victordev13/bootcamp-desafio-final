import React from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'api' });

export default function App() {
    const periods = () => {
        const dateYear = new Date().getFullYear();
        const years = [dateYear - 1, dateYear, dateYear + 1];
        const months = [
            'JAN',
            'FEV',
            'MAR',
            'ABR',
            'MAI',
            'JUN',
            'JUL',
            'AGO',
            'SET',
            'OUT',
            'NOV',
            'DEZ',
        ];
        let allPeriods = [];

        years.forEach((year) => {
            months.forEach((month, index) => {
                allPeriods.push({
                    value: `${year}-${(index + 1).toString().padStart(2, '0')}`,
                    text: `${month}/${year}`,
                });
            });
        });
        return allPeriods;
    };

    const LIST_SCREEN = 0;
    const EDIT_SCREEN = 1;
    const EARNING_COLOR = '#55efc4';
    const EXPANSE_COLOR = '#fab1a0';

    const [transactions, setTransactions] = React.useState([]);
    const [filteredTransactions, setFilteredTransactions] = React.useState([]);
    const [currentPeriod, setCurrentPeriod] = React.useState(
        periods()[0].value
    );
    const [currentScreen, setCurrentScreen] = React.useState(LIST_SCREEN);
    const [filteredText, setFilteredText] = React.useState('');

    React.useEffect(() => {
        const fetchTransactions = async () => {
            const { data } = await api.get(
                `/transaction/?period=${currentPeriod}`
            );
            console.log(data);
            console.log(`/transaction/?period=${currentPeriod}`);

            setTransactions(data.transactions);
        };
        fetchTransactions();
    }, [currentPeriod]);

    React.useEffect(() => {
        let newFilteredTransactions = [...transactions];
        if (filteredText.trim() !== '') {
            console.log('Cheguei aqui, texto: ' + filteredText);
            newFilteredTransactions = newFilteredTransactions.filter(
                (transaction) => {
                    return transaction.description
                        .toLowerCase()
                        .includes(filteredText);
                }
            );
            console.log(newFilteredTransactions);
        }
        setFilteredTransactions(newFilteredTransactions);
    }, [transactions, filteredText]);

    const handlePeriodChange = (event) => {
        const newPeriod = event.target.value;
        setCurrentPeriod(newPeriod);
    };

    const handleDeleteTransaction = async (event) => {
        const id = event.target.id;
        await api.delete('/transaction/' + id);

        const newTransactions = transactions.filter((transaction) => {
            return transaction._id !== id;
        });
        setTransactions(newTransactions);
    };

    const handleFilterChange = (event) => {
        const text = event.target.value;
        setFilteredText(text);
    };
    return (
        <div className="container">
            <h1 className="center">Desafio Final</h1>
            {currentScreen === LIST_SCREEN ? (
                <>
                    <select
                        className="browser-default"
                        value={currentPeriod}
                        onChange={handlePeriodChange}
                    >
                        {periods().map((period) => {
                            return (
                                <option value={period.value} key={period.text}>
                                    {period.text}
                                </option>
                            );
                        })}
                    </select>

                    <input
                        type="text"
                        placeholder="Filtro..."
                        value={filteredText}
                        onChange={handleFilterChange}
                    />

                    {filteredTransactions.map((transaction) => {
                        const currentColor =
                            transaction.type === '+'
                                ? EARNING_COLOR
                                : EXPANSE_COLOR;
                        return (
                            <div
                                key={transaction._id}
                                style={{
                                    ...styles.transactionStyle,
                                    backgroundColor: currentColor,
                                }}
                            >
                                <span style={styles.btnStyle}>
                                    <button className="waves-effect waves-light btn">
                                        Editar
                                    </button>
                                    <button
                                        className="waves-effect waves-light btn red darken-4"
                                        onClick={handleDeleteTransaction}
                                        id={transaction._id}
                                    >
                                        Excluir
                                    </button>
                                </span>
                                {transaction.yearMonthDay} / {''}
                                <strong>{transaction.category}</strong> -
                                {transaction.description} - {transaction.value}
                            </div>
                        );
                    })}
                </>
            ) : (
                <p>Tela de edição</p>
            )}
        </div>
    );
}

const styles = {
    transactionStyle: {
        padding: '5px 10px ',
        margin: '5px',
        border: '1px solid lightgrey',
        borderRadius: '5px',
    },
    btnStyle: { margin: '10px' },
};
