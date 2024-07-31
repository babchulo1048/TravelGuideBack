import Chapa from "chapa";

interface CustomerInfo {
  amount: string;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  // tx_ref?: string; // Uncomment if you want to optionally provide a reference
  callback_url: string;
  customization: {
    title: string;
    description: string;
  };
}

interface InitializeResponse {
  message: string;
  status: "success" | "failed";
  data: {
    checkout_url: string;
  };
  tx_ref: string;
}

interface VerifyResponse {
  // Define the structure of the verify response here if available
  // Example:
  status: string;
  message: string;
  data: {
    reference: string;
    status: string;
    amount: string;
    currency: string;
    customer: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

const myChapa = new Chapa("secret-key");

const customerInfo: CustomerInfo = {
  amount: "100",
  currency: "ETB",
  email: "abebe@bikila.com",
  first_name: "Abebe",
  last_name: "Bikila",
  callback_url: "https://chapa.co", // your callback URL
  customization: {
    title: "I love e-commerce",
    description: "It is time to pay",
  },
};

// Using Promises
myChapa
  .initialize(customerInfo, { autoRef: true })
  .then((response: InitializeResponse) => {
    /*
    response:
      {
        message: 'Hosted Link',
        status: 'success' || 'failed',
        data: {
          checkout_url: 'https://checkout.chapa.co/checkout/payment/:token'
        },
        tx_ref: 'generated-token' // this will be the auto generated reference
      }
    */
    console.log(response);
    // saveReference(response.tx_ref);
  })
  .catch((e: any) => console.log(e)); // catch errors

// Using async/await
const initTransaction = async () => {
  try {
    const response: InitializeResponse = await myChapa.initialize(
      customerInfo,
      { autoRef: true }
    );
    console.log(response);
    // saveReference(response.tx_ref);
  } catch (e) {
    console.log(e);
  }
};

initTransaction();

// Verify transaction using Promises
myChapa
  .verify("CHASECK_TEST-loZcHNnA4a93TT7RlXAni3tbk6nxtt5D")
  .then((response: VerifyResponse) => {
    console.log(response); // if success
  })
  .catch((e: any) => console.log(e)); // catch errors

// Verify transaction using async/await
const verifyTransaction = async (reference: string) => {
  try {
    const response: VerifyResponse = await myChapa.verify(reference);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
};

verifyTransaction("txn-reference");
