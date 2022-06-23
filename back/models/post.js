// mysql의 테이블이 여기서는 model
module.exports = (sequelize, DataType) => {
    const Post = sequelize.define('Post', { 
        //id는 기본적으로 1,2,3,4 ... 순서대로 올라간다
        content: {
            type: DataType.TEXT,
            allowNull: false, // 필수
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', //한글, 이모티콘 저장
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashTag'});
        db.Post.hasMany(db.Comment);  
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post, { as: 'Retweet'})
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers'})
    };
    return Post;
}