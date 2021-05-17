const typeFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|py)$/)) {
        req.fileValidationError = 'Only python files are allowed!';
        return cb(new Error('Only python files are allowed!'), false);
    }
    cb(null, true);
};
exports.typeFilter = typeFilter;
