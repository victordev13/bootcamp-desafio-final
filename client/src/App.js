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

    React.useEffect(() => {
        const fetchTransactions = async () => {
            const { data } = await api.get(
                `/transaction/?period=${currentPeriod}`
            );
            console.log(data);
            console.log(`/transaction/?period=${currentPeriod}`);

            setTransactions(data.transactions);
            setFilteredTransactions(data.transactions);
        };
        fetchTransactions();
    }, [currentPeriod]);

    const handlePeriodChange = (event) => {
        const newPeriod = event.target.value;
        setCurrentPeriod(newPeriod);
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

                    {filteredTransactions.map((transaction) => {
                        const currentColor =
                            transaction.type === '+'
                                ? EARNING_COLOR
                                : EXPANSE_COLOR;
                        return (
                            <p
                                key={transaction._id}
                                style={{
                                    ...styles.transactionStyle,
                                    backgroundColor: currentColor,
                                }}
                            >
                                {transaction.yearMonthDay} / {''}
                                <strong>{transaction.category}</strong> -
                                {transaction.description} - {transaction.value}
                            </p>
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
};
