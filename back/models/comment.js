// mysql의 테이블이 여기서는 model
module.exports = (sequelize, DataType) => {
    const Comment = sequelize.define('Comment', { 
        //id는 기본적으로 1,2,3,4 ... 순서대로 올라간다
        content: {
            type: DataType.TEXT,
            allowNull: false, // 필수
        },
    }, {
        modelName: 'Comment',
        tableName: 'comments',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', //한글, 이모티콘 저장
    });
    // userId 1
    // postId 3 같은 고유한 것이 생김
    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    };
    return Comment;
}