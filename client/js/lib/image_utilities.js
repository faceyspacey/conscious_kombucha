getImageFromUrl = function(url, callback) {
    var img = new Image(), data, ret = {
        data: null,
        pending: true
    };

    img.onError = function() {
        throw new Error('Cannot load image: "'+url+'"');
    };
    img.onload = function() {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        canvas.width = img.width;
        canvas.height = img.height;


        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // Grab the image as a jpeg encoded in base64, but only the data
        data = canvas.toDataURL('image/jpeg').slice('data:image/jpeg;base64,'.length);
        // Convert the data to binary form
        data = atob(data);
        document.body.removeChild(canvas);

        ret['data'] = data;
        ret['pending'] = false;
        if (typeof callback === 'function') {
            callback(data);
        }
    };
    img.src = url;

    return ret;
};


getImagesFromUrls = function(urlsObject, callback) {
    var imageDatas = {},
        callbacks = [],
        len,
        c = 0;

    for(var i in urlsObject){
        len = callbacks.length;
        callbacks[len] = (function(curr){
            return function(){
                getImageFromUrl(urlsObject[i], function(imgData){
                    imageDatas[i] = imgData;
                    console.log(imageDatas);
                    if( typeof callbacks[(curr+1)] == 'function' ){
                        callbacks[curr+1].call(curr+1);
                    }
                });
            };
        })(c);
        c++;
    }

    len = callbacks.length;
    callbacks[len] = function(curr){
        if (typeof callback === 'function') {
            callback(imageDatas);
        }
    };


    if( typeof callbacks[0] == 'function' )
        callbacks[0].call(0);

    return imageDatas;
};