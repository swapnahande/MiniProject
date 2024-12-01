import nodemailer from 'nodemailer';
import Sentiment from 'sentiment';
import imaps, { ImapSimple, ImapConfig, Message, SearchCriteria, FetchOptions } from 'imap-simple';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// IMAP Configuration (use environment variables for security)
const imapConfig: ImapConfig = {
    imap: {
        user: process.env.EMAIL_USER || '',
        password: process.env.EMAIL_PASS || '',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }, // Bypass self-signed certificates
        authTimeout: 10000
    }
};

// Interface for email message
interface EmailMessage {
    id: string;
    body: string;
    sentiment?: string;
}

// Fetch unread emails
const fetchUnreadEmails = async (): Promise<EmailMessage[]> => {
    try {
        const connection: ImapSimple = await imaps.connect(imapConfig);
        await connection.openBox('INBOX');

        // Search for unread emails
        const searchCriteria: SearchCriteria[] = ['UNSEEN'];
        const fetchOptions: FetchOptions = { bodies: ['TEXT'], markSeen: true };

        const messages: Message[] = await connection.search(searchCriteria, fetchOptions);

        const extractedMessages: EmailMessage[] = messages.map((item) => {
            try {
                // Get all parts of the email structure
                const allParts = imaps.getParts(item.attributes.struct || []);

                // Find the plain text or HTML part
                const textPart = allParts.find((part) => part.type === 'text/plain') || 
                                 allParts.find((part) => part.type === 'text/html');
                
                // Decode the body content (handles encoding)
                const body = textPart ? Buffer.from(textPart.body, 'base64').toString('utf-8') : 'No content available.';
                
                return { id: item.attributes.uid.toString(), body };
            } catch (err) {
                console.error('Error processing email:', err);
                return { id: item.attributes?.uid.toString() || 'unknown', body: 'Error reading content.' };
            }
        });

        await connection.end();
        return extractedMessages;
    } catch (error) {
        console.error('Error fetching emails:', error);
        return [];
    }
};

// Perform sentiment analysis
const analyzeSentiments = (messages: EmailMessage[]): EmailMessage[] => {
    const sentiment = new Sentiment();
    return messages.map((msg) => {
        const analysis = sentiment.analyze(msg.body);
        const sentimentResult = analysis.score > 0 ? 'Positive' :
            analysis.score < 0 ? 'Negative' : 'Neutral';
        return { ...msg, sentiment: sentimentResult };
    });
};

// Monitor and analyze new emails
const monitorEmails = async (): Promise<void> => {
    console.log('Monitoring inbox for new emails...');
    setInterval(async () => {
        const messages = await fetchUnreadEmails();

        if (messages.length > 0) {
            console.log('New Emails Found:', messages);

            // Analyze sentiments of new emails
            const messagesWithSentiment = analyzeSentiments(messages);
            console.log('Messages with Sentiment:', messagesWithSentiment);
        } else {
            console.log('No new emails at this time.');
        }
    }, 60000); // Check for new emails every 60 seconds
};

// Run the monitoring function
monitorEmails();
