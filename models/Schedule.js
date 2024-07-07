const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Schedule = sequelize.define('Schedule', {
    userID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        type: DataTypes.DATE
    },
    description: {
        type: DataTypes.TEXT
    },
    color: {
        type: DataTypes.STRING(7)
    }
}, {
    tableName: 'schedules',
    timestamps: true
});

module.exports = Schedule;