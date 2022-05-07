const mongoose = require('mongoose');
const NewsSchema = require('./newsSchema');
const NewsModel = mongoose.model('News',NewsSchema,'news'); // moduleName Schema CollectionName

module.exports = NewsModel;