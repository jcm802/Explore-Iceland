// Utility function to make try catch process over async functions modular
module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next);
    }
}