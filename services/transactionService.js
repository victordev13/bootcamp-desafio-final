const mongoose = require('mongoose');

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');
const DATE_LENGTH = 8;
const ID_LENGTH = 24;

const create = async (req, res) => {
    const { description, category, value, yearMonthDay, type } = req.body;

    if (yearMonthDay.length < DATE_LENGTH) {
        res.status(501).send({ error: 'Formato de data inválida!' });
    }

    if (!req.body) {
        res.status(500).send({ error: 'Nenhum dado recebido!' });
    }

    try {
        const transaction = {
            description,
            value,
            category,
            year: Number(yearMonthDay.substring(0, 4)),
            month: Number(yearMonthDay.substring(5, 7)),
            day: Number(yearMonthDay.substring(8, 10)),
            yearMonth: yearMonthDay.substring(0, 7),
            yearMonthDay,
            type,
        };
        let newTransaction = new TransactionModel(transaction);
        newTransaction = await newTransaction.save();
        console.log(newTransaction);
        res.status(200).send({ message: 'Ok', transaction: newTransaction });
    } catch (error) {
        res.status(500).send({
            error: 'Ocorreu um erro na inserção! :' + error + '/' + req.body,
        });
    }
};

const findByPeriod = async (req, res) => {
    const period = req.query.period;
    if (!period) {
        throw new Error(
            'É necessário informar o parâmetro "period", cujo valor deve estar no formato yyyy-mm.'
        );
    }

    if (period.length !== 7) {
        throw new Error(
            'Período inválido, o valor deve estar no formato yyyy-mm.'
        );
    }

    try {
        const data = await TransactionModel.find({ yearMonth: period });
        !data
            ? res.status(500).send({ message: 'Nenhum dado encontrado.' })
            : res.send({ length: data.length, transactions: [...data] });
    } catch (error) {
        res.status(400).send({
            error: error.message,
        });
    }
};

const findOne = async (req, res) => {
    const id = req.params.id;
    if (validateId(id)) {
        res.status(500).send({
            error: 'É necessário informar o id do item.',
        });
        return;
    }

    try {
        const data = await TransactionModel.findById(id);
        !data
            ? res.status(500).send({ message: 'Nenhum dado encontrado.' })
            : res.send(data);
    } catch (error) {
        res.status(400).send({
            error: 'Erro ao consultar item!',
        });
    }
};

const remove = async (req, res) => {
    const id = req.params.id;
    if (validateId(id)) {
        res.status(500).send({
            error: 'É necessário informar o id do item.',
        });
        return;
    }
    try {
        const data = await TransactionModel.findByIdAndDelete(id);
        if (!data) {
            throw new Error('não encontrado');
        }
        res.send({ message: 'ok' });
    } catch (error) {
        res.status(500).send({
            error: 'Erro ao excluir item id:' + id + ' / ' + error,
        });
    }
};

const update = async (req, res) => {
    const id = req.params.id;

    if (validateId(id)) {
        res.status(501).send({
            error: 'É necessário informar o id do item.',
        });
        return;
    }
    if (!req.body) res.status(400).send('Dados não informados.');

    try {
        let updatedTransaction = await TransactionModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        updatedTransaction = await updatedTransaction.save();
        console.log(updatedTransaction);
        res.status(200).send({ message: 'ok', data: updatedTransaction });
    } catch (error) {
        res.status(500).send({
            error: 'Erro ao atualizar item id: ' + id + '/' + error,
        });
    }
};

//Funções auxiliares

const getAllDateFields = (date) => {
    console.log(date);

    let allDate = {
        year: Number(date.substring(0, 4)),
        month: Number(date.substring(5, 7)),
        day: Number(date.substring(8, 10)),
        yearMonth: `${year}-${month}`,
        yearMonthDay: date,
    };
    console.log(allDate);
    return ({ year, month, day, yearMonth, yearMonthDay } = allDate);
};

const validateId = (id) => {
    return !id || id.length < ID_LENGTH;
};
module.exports = { create, findByPeriod, findOne, remove, update };
