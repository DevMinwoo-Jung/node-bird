// mysql의 테이블이 여기서는 model
module.exports = (sequelize, DataType) => {
    const Hashtag = sequelize.define('Hashtag', { 
        //id는 기본적으로 1,2,3,4 ... 순서대로 올라간다
        name: {
            type: DataType.STRING(20),
            allowNull: false, // 필수
        },
    }, {
        modelName: 'Hashtag',
        tableName: 'hashtags',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', //한글, 이모티콘 저장
    });
    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    };
    return Hashtag;
}