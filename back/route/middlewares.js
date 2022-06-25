exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('need login.')
    } 
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('can access only who not login')
    }
}


// 지금 위의 것들을 여기서 하는게 아니라 route에서 해도 될 텐데 왜 따로 뺐을까?? -> 코드의 중복 제거