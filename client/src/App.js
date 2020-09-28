import React from 'react';
import axios from 'axios';
import ListScreen from './components/ListScreen';
import MaintenenceScreen from './components/MaintenenceScreen';

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
    const MAINTENENCE_SCREEN = 1;

    const [transactions, setTransactions] = React.useState([]);
    const [filteredTransactions, setFilteredTransactions] = React.useState([]);
    const [currentPeriod, setCurrentPeriod] = React.useState(
        periods()[0].value
    );
    const [currentScreen, setCurrentScreen] = React.useState(LIST_SCREEN);
    const [filteredText, setFilteredText] = React.useState('');
    const [selectedTransaction, setSelectedTransaction] = React.useState(null);
    const [newTransaction, setNewTransaction] = React.useState(false);

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

    React.useEffect(() => {
        const newScreen =
            selectedTransaction !== null || newTransaction
                ? MAINTENENCE_SCREEN
                : LIST_SCREEN;
        setCurrentScreen(newScreen);
    }, [selectedTransaction, newTransaction]);

    const handlePeriodChange = (event) => {
        const newPeriod = event.target.value;
        setCurrentPeriod(newPeriod);
    };

    const handleDeleteTransaction = async (event) => {
        const id = event.target.id;
        const newTransactions = transactions.filter((transaction) => {
            return transaction._id !== id;
        });
        await api
            .delete('/transaction/' + id)
            .then(setTransactions(newTransactions));
    };

    const handleFilterChange = (event) => {
        const text = event.target.value;
        setFilteredText(text);
    };

    const handleEditTransaction = (event) => {
        const id = event.target.id;
        const newSelectedTransaction = filteredTransactions.find(
            (transaction) => {
                return transaction._id === id;
            }
        );

        setSelectedTransaction(newSelectedTransaction);
    };

    const handleCancelMaintenence = () => {
        setNewTransaction(false);
        setSelectedTransaction(null);
    };

    const handleSaveMaintenence = async (newTransaction) => {
        const { _id } = newTransaction;

        if (!_id) {
            const newTransactionForInsert = {
                ...newTransaction,
                // year: Number(newTransaction.yearMonthDay.substring(0, 4)),
                // month: Number(newTransaction.yearMonthDay.substring(5, 7)),
                // day: Number(newTransaction.yearMonthDay.substring(8, 10))
            };
            //
            console.log(newTransactionForInsert);
            //
            const inserted = await api.post(
                `/transaction/`,
                newTransactionForInsert
            );
            console.log(inserted);
        } else {
            const completeTransaction = {
                ...newTransaction,
                // year: Number(newTransaction.yearMonthDay.substring(0, 4)),
                // month: Number(newTransaction.yearMonthDay.substring(5, 7)),
                // day: Number(newTransaction.yearMonthDay.substring(8, 10))
            };
            await api.put(`/transaction/${_id}`, completeTransaction);
            let newTransactions = [...transactions];
            const index = newTransactions.findIndex((transaction) => {
                return transaction._id === completeTransaction._id;
            });
            newTransactions[index] = completeTransaction;
            setTransactions(newTransactions);
        }

        setSelectedTransaction(null);
    };

    const handleNewTransaction = () => {
        setNewTransaction(true);
    };

    return (
        <div className="container">
            <h1 className="center">Desafio Final</h1>
            {currentScreen === LIST_SCREEN ? (
                <ListScreen
                    transactions={filteredTransactions}
                    periods={periods}
                    filteredText={filteredText}
                    onChangeFilter={handleFilterChange}
                    onDeleteTransaction={handleDeleteTransaction}
                    currentPeriod={currentPeriod}
                    onChangePeriod={handlePeriodChange}
                    onEditTransaction={handleEditTransaction}
                    onNewTransaction={handleNewTransaction}
                />
            ) : (
                <MaintenenceScreen
                    transaction={selectedTransaction}
                    onCancel={handleCancelMaintenence}
                    onSave={handleSaveMaintenence}
                />
            )}
        </div>
    );
}
