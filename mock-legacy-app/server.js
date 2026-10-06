const express = require('express');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8082;
const ADAPTER_URL = process.env.ADAPTER_URL || 'http://localhost:8081';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware: Simulates legacy server-side session check
async function requireAuth(req, res, next) {
    const token = req.cookies['LATCHPOINT_SESSION'];
    if (!token) {
        return res.redirect('/?error=unauthorized');
    }

    try {
        const response = await axios.get(`${ADAPTER_URL}/api/v1/legacy/check-session`, {
            headers: { Cookie: `LATCHPOINT_SESSION=${token}` },
        });

        if (response.data && response.data.valid) {
            req.user = response.data;
            return next();
        }
    } catch (err) {
        console.warn('Session invalid or Adapter unreachable:', err.message);
    }

    res.clearCookie('LATCHPOINT_SESSION');
    return res.redirect('/?error=expired');
}

// 1. Route: Check session on root load
app.get('/', (req, res) => {
    const token = req.cookies['LATCHPOINT_SESSION'];
    if (token) {
        return res.redirect('/portal');
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Route: Legacy Form Login POST
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const response = await axios.post(
            `${ADAPTER_URL}/api/v1/legacy/login`,
            new URLSearchParams({ username, password }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        // Case A: MFA Challenge Required
        if (response.data && response.data.mfaRequired) {
            return res.json({
                mfaRequired: true,
                mfaChallengeId: response.data.mfaChallengeId,
            });
        }

        // Case B: Direct Login Success (forward Set-Cookie header)
        if (response.headers['set-cookie']) {
            res.setHeader('Set-Cookie', response.headers['set-cookie']);
        }
        return res.json({ success: true, redirect: '/portal' });
    } catch (err) {
        const status = err.response ? err.response.status : 500;
        const msg = status === 401 ? 'Invalid username or password' : 'Authentication service unavailable';
        return res.status(status).json({ success: false, error: msg });
    }
});

// 3. Route: MFA Verification POST
app.post('/verify-mfa', async (req, res) => {
    const { mfaChallengeId, code } = req.body;

    try {
        const response = await axios.post(
            `${ADAPTER_URL}/api/v1/legacy/verify-mfa`,
            new URLSearchParams({ mfaChallengeId, code }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        if (response.headers['set-cookie']) {
            res.setHeader('Set-Cookie', response.headers['set-cookie']);
        }
        return res.json({ success: true, redirect: '/portal' });
    } catch (err) {
        const status = err.response ? err.response.status : 500;
        return res.status(status).json({ success: false, error: 'Invalid authentication code' });
    }
});

// 4. Route: Protected Legacy Business Portal (Warehouse Inventory)
app.get('/portal', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'portal.html'));
});

// Helper for UI to get logged in username
app.get('/api/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
});

// 5. Route: Legacy Logout
app.post('/logout', async (req, res) => {
    const token = req.cookies['LATCHPOINT_SESSION'];

    try {
        if (token) {
            await axios.post(
                `${ADAPTER_URL}/api/v1/legacy/logout`,
                {},
                { headers: { Cookie: `LATCHPOINT_SESSION=${token}` } }
            );
        }
    } catch (err) {
        console.warn('Logout downstream error:', err.message);
    }

    res.clearCookie('LATCHPOINT_SESSION');
    return res.redirect('/?logged_out=true');
});

app.listen(PORT, () => {
    console.log(`[Riverside Legacy Portal] running at http://localhost:${PORT}`);
    console.log(`[Riverside Legacy Portal] pointing to Adapter at ${ADAPTER_URL}`);
});