const router = require('koa-router')()
const store = require('../store')

router.prefix('/tasks')

router.post('/add', async (ctx, next) => {
    if(ctx.request.body.title != "") {
	 await store.createTask(ctx.request.body.title, ctx.request.body.msg)
	 ctx.redirect('/')
    } else {
      	await ctx.render('errorMessage', {
	    message: "Tytuł nie może być pusty"
        })
    }
})

module.exports = router
