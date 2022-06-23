const express = require('express')

const router = express.Router();
router.post('/', (req, res) => {
    res.send('작성 완료!')
})

router.delete('/', (req, res) => {
    res.send('hello API!')
})

module.exports = router;