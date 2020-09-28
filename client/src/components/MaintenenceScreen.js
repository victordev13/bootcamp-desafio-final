import React from 'react';

const INSERTING = 0;
const EDITING = 1;

function today() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const today = `${year}-${month}-${day}`;
    return today;
}

export default function MaintenenceScreen({ transaction, onCancel, onSave }) {
    const [description, setDescription] = React.useState('');
    const [value, setValue] = React.useState(0);
    const [category, setCategory] = React.useState('');
    const [date, setDate] = React.useState(today());
    const [type, setType] = React.useState('-');
    const [mode, setMode] = React.useState(INSERTING);

    React.useEffect(() => {
        if (!transaction) {
            setMode('insert');
            return;
        }

        const {
            description,
            value,
            category,
            yearMonthDay,
            type,
        } = transaction;

        setMode(EDITING);
        setDescription(description);
        setValue(value);
        setCategory(category);
        setDate(yearMonthDay);
        setType(type);
    }, [transaction]);

    const handleDescription = (event) => {
        const newDescription = event.target.value;
        setDescription(newDescription);
    };
    const handleValue = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
    };
    const handleCategory = (event) => {
        const newCategory = event.target.value;
        setCategory(newCategory);
    };
    const handleDate = (event) => {
        const newDate = event.target.value.trim();
        console.log(newDate);
        setDate(newDate);
    };
    const handleType = (event) => {
        const newType = event.target.value;
        setType(newType);
    };
    const handleFormSubmit = (event) => {
        event.preventDefault();

        const newTransaction = {
            _id: !!transaction ? transaction._id : null,
            description,
            value,
            type,
            yearMonthDay: date,
            category,
        };
        onSave(newTransaction);
    };

    const handleCancelClick = () => {
        onCancel();
    };
    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <div className="row">
                    <div style={customStyles.flexRadio}>
                        <p>
                            <label>
                                <input
                                    name="type"
                                    type="radio"
                                    value="-"
                                    checked={type === '-'}
                                    disabled={mode === EDITING}
                                    onChange={handleType}
                                />
                                <span>Despesa</span>
                            </label>
                        </p>
                        <p>
                            <label>
                                <input
                                    name="type"
                                    type="radio"
                                    value="+"
                                    checked={type === '+'}
                                    disabled={mode === EDITING}
                                    onChange={handleType}
                                />
                                <span>Receita</span>
                            </label>
                        </p>
                    </div>
                </div>
                <div className="input-field col s12">
                    <input
                        placeholder="Descrição"
                        id="description"
                        type="text"
                        value={description}
                        onChange={handleDescription}
                        required
                    />
                    <label htmlFor="description" className="active">
                        Descrição
                    </label>
                </div>

                <div className="input-field col s12">
                    <input
                        placeholder="Categoria"
                        id="category"
                        type="text"
                        value={category}
                        onChange={handleCategory}
                        required
                    />
                    <label htmlFor="category" className="active">
                        Categoria
                    </label>
                </div>

                <div className="row">
                    <div className="input-field col s6">
                        <input
                            id="value"
                            type="number"
                            value={value}
                            onChange={handleValue}
                            required
                        />
                        <label htmlFor="value" className="active">
                            Valor
                        </label>
                    </div>
                    <div className="input-field col s6">
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={handleDate}
                            required
                        />
                        <label htmlFor="date" className="active">
                            Data
                        </label>
                    </div>
                    <input
                        type="submit"
                        className="waves-effect waves-light btn"
                        value="Salvar"
                    />

                    <button
                        type="button"
                        className="waves-effect waves-light btn red darken-4"
                        onClick={handleCancelClick}
                        style={{ marginLeft: '10px' }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        zIndex: '1000',
        minWidth: '400px',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    flexRadio: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    title: {
        fontSize: '18pt',
        fontWeight: 'bold',
    },
};
