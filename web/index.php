<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome - First Groups Accounting</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .landing {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
            color: white;
            text-align: center;
            padding: 32px;
        }
        .landing-content {
            max-width: 600px;
        }
        .landing h1 {
            font-size: 48px;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-bottom: 16px;
        }
        .landing p {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 32px;
        }
        .landing .btn {
            background: white;
            color: var(--primary);
            font-size: 16px;
            padding: 16px 32px;
        }
        .landing .btn:hover {
            background: #F8F9FB;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-top: 48px;
        }
        .feature {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 24px;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .feature h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .feature p {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 0;
        }
        @media (max-width: 768px) {
            .landing h1 {
                font-size: 32px;
            }
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="landing">
        <div class="landing-content">
            <h1>FIRST GROUPS<br>ACCOUNTING</h1>
            <p>Your luxury personal finance management platform. Build wealth with discipline and elegance.</p>
            <a href="dashboard.php" class="btn">Enter Dashboard</a>

            <div class="features">
                <div class="feature">
                    <h3>Smart Savings</h3>
                    <p>Create automated savings plans and achieve your financial goals</p>
                </div>
                <div class="feature">
                    <h3>Investment Circles</h3>
                    <p>Join collaborative groups and invest together</p>
                </div>
                <div class="feature">
                    <h3>Bill Management</h3>
                    <p>Never miss a payment with our bill tracking system</p>
                </div>
            </div>
        </div>
    </div>

    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>
