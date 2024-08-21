export const getOtpEmail = (name: string, otp: string) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            padding: 10px 0;
            color: #ffffff;
            border-radius: 10px 10px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .otp {
            font-size: 30px;
            color: #333333;
            letter-spacing: 2px;
            margin: 20px 0;
        }
        .message {
            font-size: 16px;
            color: #555555;
            margin: 20px 0;
        }
        .footer {
            font-size: 14px;
            color: #999999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your OTP Code</h1>
        </div>
        <div class="message">
            <p>Dear ${name},</p>
            <p>Your one-time password (OTP) for completing your transaction is:</p>
        </div>
        <div class="otp">
            ${otp}
        </div>
        <div class="message">
            <p>Please enter this code to proceed with your transaction. This code is valid for the next 10 minutes.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Thank you for using our service!</p>
        </div>
    </div>
</body>
</html>
    `;
};
