const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/User');

// Google認証の設定
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async(accessToken, refreshToken, profile, done) => {
        // プロフィール情報を使用してユーザーを検索または作成
        const id = profile.id;
        const displayName = profile.displayName;
        let user = await User.findOne({ where: { id } });
        if (!user) {
            user = await User.create({ id, displayName });
        }
        done(null, user);
}));

// ユーザーシリアライズ
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// ユーザーデシリアライズ
passport.deserializeUser((id, done) => {
    // データベースからユーザー情報を取得してセッションに保存
    const user = { id: id, displayName: 'User Display Name' }; // 実際にはデータベースから取得
    done(null, user);
});

module.exports = passport;
