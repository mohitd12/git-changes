const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./creds.json');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/loan');  
})

app.get('/thankspage', (req, res) => {
    res.render('thanks-page')
})

app.get('/insurance', (req, res) => {
    res.render('loan-form');
})

app.get('/loan', (req, res) => {
    res.render('loan-form');
})

async function accessSp() {
    const doc = new GoogleSpreadsheet('17Gi0KGMWchCzAWL2xHt7uP1itxmGHJASW3fIsAmydYc');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key
    })

    await doc.loadInfo();
    console.log(doc.title);

    const sheet = doc.sheetsByIndex[0];
    
    console.log(sheet.title);
}

app.post('/loan', async (req, res) => {
    const doc = new GoogleSpreadsheet('17Gi0KGMWchCzAWL2xHt7uP1itxmGHJASW3fIsAmydYc');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key
    })

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const addNew = {
        fullname: req.body.fullname,
        loan_amount: req.body.loan_amount,
        income: req.body.income,
        phone: req.body.phone,
        email: req.body.email,
        profession: req.body.profession,
        city: req.body.city,
        state: req.body.state
    }

    await sheet.addRow(addNew);
    res.redirect('/thankspage');
})

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log('server is listening...')
})

