// mysql의 테이블이 여기서는 model
module.exports = (sequelize, DataType) => {
    const User = sequelize.define('User', { // mysql에서는 users 테이블로 생성됨 소문자에 복수형으로 바뀜
        //id는 기본적으로 1,2,3,4 ... 순서대로 올라간다
        email: {
            type: DataType.STRING(30),
            allowNull: false, // 필수
            unique: true, // 고유한 값
        },
        nickname: {
            type: DataType.STRING(30),
            allowNull: false, // 필수
        },
        password: {
            type: DataType.STRING(100),
            allowNull: false, // 필수
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', //한글저장
    });
    User.associate = (db) => {};
    return User;
}