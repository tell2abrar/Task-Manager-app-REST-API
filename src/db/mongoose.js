const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,
    {useNewUrlParser: true, useUnifiedTopology: true})
        .then(res=>console.log('connected to mongodb via mongoose!'))
            .catch(error => handleError(error));



