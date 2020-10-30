const express = require('express')
const hbs = require('express-handlebars')

// init variables
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

// create app
const app = express()


// set view engine
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs'
}))
app.set('view engine', 'hbs')

// configure app
app.get('/', (req, res) => {
    const cart = []



    res.status(200).type('text/html')
    res.render('cart', {


        cartEmpty: cart.length > 0,
        cartState: JSON.stringify(cart),

    })
})
    .post('/', express.urlencoded({
        extended: true
    }), (req, res) => {
        const product = req.body.product
        const qty = parseInt(req.body.qty)
        const price = parseInt(req.body.price)
        const subtotal = qty * price
        // makes cart a array
        // json string is parsed into json object
        const cart = JSON.parse(req.body.cartState)
        cart.push({ product, qty, price, subtotal })
        console.info('cart :', cart)
        console.info('Number of items in cart: ', cart.length)
        const itemSubTotal = []
        for (let i = 0; i < cart.length; i++) {
            itemSubTotal.push(cart[i].price * cart[i].qty)
        }
        const grandTotal = itemSubTotal.reduce((total, cur) => total + cur)
        console.info('grandtotal: ', grandTotal)
        res.status(201).type('text/html')
        res.render('cart', {
            cart: cart,
            cartState: JSON.stringify(cart),
            cartEmpty: cart.length > 0,
            grandTotal: grandTotal
        })

    })

app.use(express.static('public'))

// app listening
app.listen(PORT, () => {
    console.info(`App started on ${PORT} on http://localhost:${PORT} on ${new Date()}`)
})
