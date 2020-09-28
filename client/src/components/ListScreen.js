import React from 'react';

export default function ListScreen({
    transactions,
    periods,
    onDeleteTransaction,
    filteredText,
    onChangeFilter,
    currentPeriod,
    onChangePeriod,
    onEditTransaction,
    onNewTransaction
}) {
    const EARNING_COLOR = '#55efc4';
    const EXPANSE_COLOR = '#fab1a0';
    return (
        <div>
            <>
                <select
                    className="browser-default"
                    value={currentPeriod}
                    onChange={onChangePeriod}
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
                    onChange={onChangeFilter}
                    style={{ marginTop: '20 px', marginBottom: '20px' }}
                />

                <button className="waves-effect waves-light btn" style={{ marginTop: '20px', marginBottom: '20px' }} onClick={onNewTransaction}>Novo lançamento</button>
                {transactions.map((transaction) => {
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
                                <button
                                    className="waves-effect waves-light btn"
                                    onClick={onEditTransaction}
                                    id={transaction._id}
                                >
                                    Editar
                                </button>
                                <button
                                    className="waves-effect waves-light btn red darken-4"
                                    onClick={onDeleteTransaction}
                                    id={transaction._id}
                                    style={{ marginLeft: '10px' }}
                                >
                                    X
                                </button>
                            </span>
                            {transaction.yearMonthDay} / {''}
                            <strong>{transaction.category}</strong> -
                            {transaction.description} - {transaction.value}
                        </div>
                    );
                })}
            </>
        </div >
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
