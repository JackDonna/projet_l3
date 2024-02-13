const asyncHandler = require("express-async-handler");
const
    {
        insert_new_absence,
        get_available_teacher,
        get_absence
    } = require(__dirname + "/cruds/crud_absence.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //
/**
 * @function ajout_absence post request to insert new absence in the sql database
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.insert_absence = asyncHandler( (req, res) => {
    insert_new_absence(req, res, (err, result) =>
    {
        if(err) {console.error(err); res.sendStatus(500)};
        res.sendStatus(200);
    });
})

/**
 * @function available_teacher get request to get the teachers available in the sql database
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.available_teacher = asyncHandler( (req, res) => {
    get_available_teacher(req, res, (err, result) =>
    {
        if(err) {console.error(err); res.sendStatus(500)};
        res.send(result);
    });
})

exports.get_available_absence = asyncHandler((req, res) => 
{
    get_absence(req, res, (err, result) =>
    {
        if(err) {console.error(err); res.sendStatus(500)};
        res.send(result);
    })
})

// exports.list_absence = asyncHandler(async (req, res, next) => {
//     let d_debut = req.params.debut
//     let d_fin = req.params.fin
//
//     Absence.select_all_absence_beewtween_two_dates(d_debut, d_fin, function(err, result){
//         res.send(result)
//     })
// })
