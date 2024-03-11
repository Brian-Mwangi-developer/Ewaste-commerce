// mpesa.ts
import axios from 'axios';

interface MpesaPaymentResponse {
    // Define the response structure according to M-Pesa API documentation
}

interface MpesaPaymentRequest {
    amount: number;
    businessShortCode: string;
    accountReference: string;
    TransactionType: string;
    partyA: string; // Sender's phone number
    partyB: string; // Business short code
    callBackURL: string;
    Password:string;
    Timestamp:string;
    phoneNumber: string;
    TransactionDesc: string;
}

class MpesaClient {
    // Your M-Pesa credentials
    private consumerKey: string = process.env.MPESA_CONSUMER_KEY!;
    private consumerSecret: string = process.env.MPESA_CONSUMER_SECRET!;
    private shortCode: string = process.env.MPESA_BUSINESS_SHORT_CODE!;
    private passkey: string = process.env.MPESA_PASS_KEY!;
    private accessToken: string | null = null;
    private accessTokenExpires: Date | null = null;

    constructor() {
        // You might want to initialize your access token here, or refresh it if it's expired
    }

    private async authenticate(): Promise<void> {
        const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64");
        try {
            const response = await axios.get<{ access_token: string, expires_in: string }>(
                "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            });
            const { access_token, expires_in } = response.data;
            this.accessToken = access_token;
            const expiresInMilliseconds = parseInt(expires_in) * 1000;
            this.accessTokenExpires = new Date(new Date().getTime() + expiresInMilliseconds);
        } catch (err: any) {
            console.log(err.message);
            throw new Error('Failed to authenticate with M-Pesa');
        }
    }

    private async getAccessToken(): Promise<string> {
        if (!this.accessToken || (this.accessTokenExpires && new Date() > this.accessTokenExpires)) {
            await this.authenticate();
        }
        if (!this.accessToken) {
            throw new Error('Access token is not available after authentication.');
        }
        return this.accessToken!;
    }

    public async createPayment(requestData: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
        const accessToken = await this.getAccessToken();

        try {
            const response = await axios.post<MpesaPaymentResponse>('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', requestData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    // Add other headers as required by M-Pesa
                },
            });

            // Handle the response as per your needs
            return response.data;
        } catch (error) {
            // Handle the error appropriately
            throw new Error('Failed to create M-Pesa payment');
        }
    }
}

export const mpesaClient = new MpesaClient();
