const express = require('express');

const session = require('express-session');
const passport = require('./auth');

const { Op } = require('sequelize');
const sequelize = require('./models');
const Schedule = require('./models/Schedule');

const moment = require('moment-timezone');

const app = express();

// セッションの設定
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // httpsを使用する場合はtrue
}));

// CORS設定
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// JSONおよびURLエンコードされたボディを解析するミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// パスポートの初期化
app.use(passport.initialize());
app.use(passport.session());

// publicディレクトリを静的ファイルのルートとして設定
app.use(express.static('public'));

// データベース同期
sequelize.sync().then(() => {
    console.log('Database synchronized');
});

// 認証ルートの設定 //
// Google認証ルート
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] })
);

// Google認証コールバック
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        req.session.userID = req.user.id;
        res.redirect('/');
    }
);

// ログアウトルート
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// ルートの設定
app.get('/', (req, res) => {
    // 未ログインの場合はログインページにリダイレクト
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.sendFile(__dirname + '/public/home.html');
});

// ログイン
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// ユーザーIDをクライアントに送信するエンドポイント
app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized');
    }
    res.json({ userID: req.session.userID });
});


app.get('/api/schedules', async (req, res) => {
    // cookie確認
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const { userID, start, end } = req.query;
        const userId = req.session.userID;

        if ( !userID || !start || !end) {
            return res.status(400).send('userID, start, and end are required');
        }
        if (userId !== userID) {
            return res.status(403).send('Forbidden');
        }

        const schedules = await Schedule.findAll({
            where: {
                userID: userID,
                start: {
                    [Op.gte]: start
                },
                end: {
                    [Op.lte]: end
                }
            }
        });

        res.json(schedules);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/schedules', async (req, res) => {
    try {
        const { userID, title, start, end, description, color } = req.body;
        const userId = req.session.userID;

        if (!userID || !title || !start) {
            return res.status(400).send('userID, title, and start are required');
        }
        if (userId !== userID) {
            return res.status(403).send('Forbidden');
        }

        const newSchedule = await Schedule.create({
            userID,
            title,
            color,
            description: description ? description : null,
            start: moment(start).add(9, 'hours'),
            end: end ? moment(end).add(9, 'hours') : null
        });

        res.json(newSchedule);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('/api/schedules/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) {
            return res.status(404).send('スケジュールが見つかりません');
        }

        const { userID, title, color, description, start, end } = req.body;
        const userId = req.session.userID;

        if (!userID || userId !== schedule.userID) return res.status(403).send('Forbidden');

        schedule.title = title;
        schedule.color = color;
        schedule.description = description ? description : null;
        schedule.start = moment(start).add(9, 'hours');
        schedule.end = end ? moment(end).add(9, 'hours') : null;

        await schedule.save();
        res.json(schedule);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/api/schedules/:id/:userid', async (req, res) => {

    if (!req.isAuthenticated()) return res.status(401).send('Unauthorized');

    const userID = req.session.userID;
    const userId = req.params.userid;
    console.log(userID, userId);
    if (userID !== userId) return res.status(403).send('Forbidden');

    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) {
            return res.status(404).send('スケジュールが見つかりません');
        }

        await schedule.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// サーバーの起動
app.listen(6500, () => {
    console.log('Server is running on port 6500');
});