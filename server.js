const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const secretHash = 'FLWSECK_TEST3c3ade88ff69'; // Your Flutterwave Encryption Key

// Serve static files
app.use(express.static(__dirname));

// Webhook endpoint for Flutterwave
app.post('/webhook', (req, res) => {
    try {
        // Verify webhook signature
        const signature = req.headers['verif-hash'];
        if (!signature || signature !== secretHash) {
            return res.status(401).send('Invalid signature');
        }

        // Get event data
        const eventData = req.body;

        // Verify the transaction
        if (eventData.event === 'charge.completed' && eventData.data.status === 'successful') {
            const transactionId = eventData.data.id;
            const amount = eventData.data.amount;
            const currency = eventData.data.currency;
            const customerEmail = eventData.data.customer.email;

            // Here you would typically:
            // 1. Verify the transaction amount and currency
            // 2. Update your database
            // 3. Send confirmation email to customer
            console.log(`Successful payment: ${amount} ${currency} from ${customerEmail}`);

            // Respond to Flutterwave
            return res.status(200).send('Webhook processed successfully');
        }

        return res.status(200).send('Event not processed');

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).send('Webhook processing failed');
    }
});

// Success page route
app.get('/payment-success', (req, res) => {
    res.send('Payment successful! Thank you for your deposit.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
