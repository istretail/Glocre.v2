const Subscriber = require('../models/subscribersModel');

// Subscribe a user
exports.subscribe = async (req, res) => {
    const { email } = req.body;

    try {
        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            if (subscriber.status === 'subscribed') {
                return res.status(400).json({ message: 'Email is already subscribed.' });
            }

            // Reactivate subscription
            subscriber.status = 'subscribed';
            subscriber.unsubscribeReason = null;
            subscriber.unsubscribedAt = null;
            await subscriber.save();

            return res.status(200).json({ message: 'Subscription reactivated successfully.' });
        }

        // New subscription
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(201).json({ message: 'Subscribed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error });
    }
};

// Unsubscribe a user
exports.unsubscribe = async (req, res) => {
    const { email, reason } = req.body;

    try {
        const subscriber = await Subscriber.findOne({ email });

        if (!subscriber || subscriber.status === 'unsubscribed') {
            return res.status(400).json({ message: 'Email is not currently subscribed.' });
        }

        subscriber.status = 'unsubscribed';
        subscriber.unsubscribeReason = reason || null;
        subscriber.unsubscribedAt = new Date();
        await subscriber.save();

        res.status(200).json({ message: 'Unsubscribed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error });
    }
};
