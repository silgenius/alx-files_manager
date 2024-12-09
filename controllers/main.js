const AppController = require('../controllers/AppController')

const express = require('express');

if (AppController.getStatus) {
        console.log('got first');
} else {
    console.log('got nothing');
}

if (AppController.getStats) {
        console.log('got second');
}