const Joi = require('joi');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const models = require("@models")
const fs = require('fs');
/*
this file should not be modified unless you want to add
a global crud fonctionality
*/
function itCouldBeAnObjectId(str) {
  if (typeof str === "string") {
    return /^[a-f\d]{24}$/i.test(str);
  } else if (Array.isArray(str)) {
    return str.every((arrStr) => /^[a-f\d]{24}$/i.test(arrStr));
  }
  return false;
}

function transformOidToObjectID(obj) {
  for (const [key, value] of Object.entries(obj)) {
    if (itCouldBeAnObjectId(value)) obj[key] = ObjectId(obj[key]);
  }
  return obj;
}
exports.removeA = function (arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
};
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
//delete old files when update
function deleteFiles(files, callback) {
  var i = files.length;
  files.forEach(function (filepath) {
    fs.access(filepath, (err) => {
      if (!err) {
        fs.unlink(filepath, function (err) {
          i--;
          if (err) {
            callback(err);
            return;
          } else if (i <= 0) {
            callback(null);
          }
        });
      }
    });

  });
}

exports.create = async function (req, res, next) {

  try {
    if (!req.body.data) {
      req.body.data = JSON.parse(JSON.stringify(req.body, getCircularReplacer()));
      req.body.data.files = req.files
      delete req.body.data.validator
      delete req.body.data.modelName
    }
    const { data } = req.body;
    const { validator, modelName } = res.locals
    let entityData =
      Object.keys(validator).length != 0
        ? await Joi.object(validator).validateAsync(data)
        : data;
    const model = models[modelName];
    const newEntity = new model(entityData);
    return newEntity
      .save()
      .then((entity) => {
        req.body.result = entity;
        next();
      })
      .catch((e) =>
        res.status(408).json({
          message: "could not create a new record, check the values you sent",
          error: e.stack,
        })
      );
  } catch (e) {
    res.status(409).json({
      message: "could not create a new record, check the options you sent",
      error: e.stack,
    });
  }
};

exports.delete = function (req, res, next) {
  const { option } = req.body;
  const { modelName } = res.locals
  const model = models[modelName];
  if (option == "one") {
    const { id } = req.params;
    model.deleteOne({ _id: id }, function (err) {
      if (err) res.status(409).json({ message: "could not delete any record" });
      else {
        req.body.result = { message: `${modelName} removed` };
        next();
      }
    });
  } else if (option == "many") {
    const query = req.body.query;
    if (!query) {
      res
        .status(400)
        .json({ message: "query for delete many must be specified !" });
    } else
      model.deleteMany(query, function (err) {
        if (err)
          res.status(409).json({ message: "could not delete any record" });
        else {
          req.body.result = { message: "Successful deletion" };
          next();
        }
      });
  } else {
    res.status(400).json({ message: "No option specified " });
  }
};

exports.update = (req, res, next) => {
  if (!req.body.data && !req.files)
    return res.status(400).json({ message: "new changes must be specified !" });
  //when call is made using form-data
  if (!req.body.data) {
    req.body.data = JSON.parse(JSON.stringify(req.body, getCircularReplacer()));
    req.body.data.files = req.files;
    delete req.body.data.validator;
    delete req.body.data.modelName;
  }
  const { option, data } = req.body;
  const { modelName } = res.locals;
  const model = models[modelName];
  const { id } = req.params;
  //when call contain photos
  if (req.files) {
    model.findByIdAndUpdate(id, data, { 'select': 'files' }, function (err, doc) {
      if (err) res.status(409).json({ message: "could not update any record", error: err.stack });
      else {
        if (doc.files.length != 0) {
          let oldFiles = []
          doc.files.forEach(file => oldFiles.push("./" + file.path));
          deleteFiles(oldFiles, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('old files removed');
            }
          });
        }

        req.body.result = { message: `${modelName} updated` };
        next();
      }
    })
  }

  else if (option == "one") {

    model.updateOne({ _id: id }, data, function (err) {
      if (err) res.status(409).json({ message: "could not update any record", error: err.stack });
      else {
        req.body.result = { message: `${modelName} updated` };
        next();
      }
    });
  } else if (option == "many") {
    if (!req.body.query) {
      res
        .status(400)
        .json({ message: "query for update many must be specified !" });
    } else {
      const query = req.body.query;
      model.updateMany(query, data, function (err) {
        if (err)
          res.status(409).json({ message: "could not update any record", error: err.stack });
        else {
          req.body.result = { message: "Successful update" };
          next();
        }
      });
    }
  } else {
    res.status(400).json({ message: "No option specified " });
  }
};
exports.updateUser = (req, res, next) => {
  if (!req.body.data && !req.files)
    return res.status(400).json({ message: "new changes must be specified !" });
  //when call is made using form-data
  if (!req.body.data) {
    req.body.data = JSON.parse(JSON.stringify(req.body, getCircularReplacer()));
    if (req.files.length >= 1) req.body.data.files = req.files[0].path
    delete req.body.data.validator
    delete req.body.data.modelName
  }
  const { option, data } = req.body;
  const { modelName } = res.locals
  const model = models[modelName];
  const { id } = req.params;
  //when call contain photos
  if (req.files.length >= 1) {
    model.findByIdAndUpdate(id, data, { 'select': 'files' }, function (err, doc) {
      if (err) res.status(409).json({ message: "could not update any record", error: err.stack });
      else {
        if (doc.files) {
          let oldFiles = []
          oldFiles.push("./" + doc.files)
          deleteFiles(oldFiles, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('old files removed');
            }
          });
        }

        req.body.result = { message: `${modelName} updated` };
        next();
      }
    })
  }

  else if (option == "one") {

    model.updateOne({ _id: id }, data, function (err) {
      if (err) res.status(409).json({ message: "could not update any record", error: err.stack });
      else {
        req.body.result = { message: `${modelName} updated` };
        next();
      }
    });
  } else if (option == "many") {
    if (!req.body.query) {
      res
        .status(400)
        .json({ message: "query for update many must be specified !" });
    } else {
      const query = req.body.query;
      model.updateMany(query, data, function (err) {
        if (err)
          res.status(409).json({ message: "could not update any record", error: err.stack });
        else {
          req.body.result = { message: "Successful update" };
          next();
        }
      });
    }
  } else {
    res.status(400).json({ message: "No option specified " });
  }
};
exports.filter = (req, res, next) => {
  let { query } = req.body;
  const { modelName } = res.locals
  if (!req.body.query)
    return res.status(409).json({ message: `could not find any ${modelName}` });
  const model = models[modelName];
  let exp = [];
  if (req.body.aggregation) {
    const aggregation = req.body.aggregation;
    let exp = [];
    if (!Array.isArray(aggregation))
      exp = [{ $match: transformOidToObjectID(query) }, aggregation];
    else {
      exp = aggregation;
      exp.unshift({ $match: transformOidToObjectID(query) });
    }
    model.aggregate(exp).exec((err, entities) => {
      if (err) {
        res.status(409).json({
          message: `could not find any ${modelName}`,
          error: err.stack,
        });
      } else {
        req.body.result = entities;
        next();
      }
    });
  } else {
    model.find(query, (err, entities) => {
      if (err) {
        res.status(409).json({
          message: `could not find any ${modelName}`,
          error: err.stack,
        });
      } else {
        req.body.result = entities;
        next();
      }
    }).sort('-createdAt');
  }
};

exports.resultHundler = (req, res, next) => {
  const result = req.body.result;
  if (result) res.json(result);
  else {
    const error = new Error("Internal server error, please try again");
    error.status = 500;
    return next(error);
  }
};