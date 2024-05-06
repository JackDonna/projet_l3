class DiffusionEngine {
    constructor(absences, matFilter, scheduleFilter, classesFilter, pool) {
        this.absences = absences;
        this.matFilter = matFilter;
        this.scheduleFilter = scheduleFilter;
        this.classesFilter = classesFilter;
        this.pool = pool;
    }

    diffuse(callback) {
        console.log(this.absences);
        this.absences.forEach((absence) => {
            let filter = new Filter(absence, this.matFilter, this.scheduleFilter, this.classesFilter, this.pool);
            filter.filter((err, filterResult) => {
                console.log("fin des filtre");
                let diffuser = new Diffuser(absence, filterResult, this.pool);
                diffuser.diffuse(callback);
            });
        });
    }
}

class TypeDefiner {
    constructor(absence) {
        this.absence = absence;
    }

    writetype() {
        if (this.absence.classes > 2) {
            this.absence.type = "CLASS";
        } else {
            this.absence.type = "NORMAL";
        }
        return this.absence;
    }
}

class Filter {
    constructor(absence, matFilter, scheduleFilter, classesFilter, pool) {
        this.absence = absence;
        this.matFilter = matFilter;
        this.scheduleFilter = scheduleFilter;
        this.classesFilter = classesFilter;
        this.pool = pool;
    }

    filter(callback) {
        this.matFilter(this.pool, this.absence, (err, matResult) => {
            if (this.absence.type === "CLASSE") {
                this.classesFilter(this.absence, matresult, (err, classesResult) => {
                    this.scheduleFilter(this.absence, classesResult, (err, scheduleResult) => {
                        callback(err, scheduleResult);
                    });
                });
            } else {
                this.scheduleFilter(this.absence, matResult, (err, scheduleResult) => {
                    callback(err, scheduleResult);
                });
            }
        });
    }
}

class Diffuser {
    constructor(absence, teachers, pool) {
        this.absence = absence;
        this.teachers = teachers;
        this.pool = pool;
    }

    diffuse(callback) {
        let query = new QueryBuilder(this.absence, this.teachers).buildQuery();
        this.pool.getConnection((err, db) => {
            db.query(
                {
                    sql: query,
                    timeout: 10000,
                },
                (err, rows, fields) => {
                    console.log("\u001b[1;32m[DIFFUSION SUCCESSFULLY DONE]");
                    callback(err, rows);
                    db.release();
                }
            );
        });
    }
}

class QueryBuilder {
    constructor(absence, teachers) {
        this.absence = absence;
        this.teachers = teachers;
    }

    buildQuery() {
        let query = `insert into Diffusion (ens, absence) value `;
        this.teachers.forEach((teacher) => {
            console.log(teacher);
            console.log(this.absence);
            query += `(${teacher.enseignant}, (select DISTINCT id_abs from Absence where date = '${this.absence.date}' and start = '${this.absence.startHour}' and end = '${this.absence.endHour}' and teacherID = ${this.absence.teacherID} limit 1)),`;
        });
        return query.slice(0, -1);
    }
}

module.exports = { DiffusionEngine };
