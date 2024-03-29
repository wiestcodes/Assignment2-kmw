var express = require('express');
var router = express.Router();

var Order = require('../models/order');

/* Validation of user */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/login');
    }
}

/* Get handler for /orders */
router.get('/', function (req, res, next) {
   Order.find(function(err, orders){
       if(err){
           console.log(err);
           res.render('error');
       }else{
           res.render('orders', {
               title: 'order list',
               orders: orders,
               user: req.user
           });
       }
   });
});

/* Get handler for /orders/add */
router.get('/add', isLoggedIn, function(req, res, next){
   res.render('add', {
        title: 'new order',
        user: req.user
   });
});

/* Post handler for /orders/add */
router.post('/add', isLoggedIn, function(req, res, next){
    Order.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        paymentType: req.body.paymentType,
        orderItem: req.body.orderItem,
        orderColour: req.body.orderColour,
        orderUnit: req.body.orderUnit,
        orderAddon: req.body.orderAddon,
        orderComment: req.body.orderComment
    }, function(err, Order){
        if(err){
            console.log(err);
            res.render('error');
        }else{
            res.redirect('/orders');
        }
    })
});

/* GET handler for /orders/delete/:_id */
router.get('/delete/:_id', isLoggedIn, function(req, res, next) {
    var _id = req.params._id;

    Order.remove( { _id: _id }, function(err) {
        if (err) {
            console.log(err);
            res.render('error', {message: 'Delete Error'});
        }
        res.redirect('/orders');
    });
});


/* GET handler for /orders/:_id  */
router.get('/:_id', isLoggedIn, function(req, res, next) {
    var _id = req.params._id;

    Order.findById(_id,  function(err, order) {
        if (err) {
            console.log(err);
            res.render('error', { message: 'Could not find Order'});
        }
        else {
            // load the edit form
            res.render('edit', {
                title: 'edit order',
                order: order,
                user: req.user
            });
        }
    });
});

/* POST /orders/:_id */
router.post('/:_id', isLoggedIn, function(req, res, next) {
    // get the id from the url
    var _id = req.params._id;

    var order = new Order( {
        _id: _id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        paymentType: req.body.paymentType,
        orderItem: req.body.orderItem,
        orderColour: req.body.orderColour,
        orderUnit: req.body.orderUnit,
        orderAddon: req.body.orderAddon,
        orderComment: req.body.orderComment
    });

    Order.update( { _id: _id }, order, function(err) {
        if (err) {
            console.log(err);
            res.render('error', {message: 'Could not make order changes'});
        }
        else {
            res.redirect('/orders');
        }
    });
});

module.exports = router;