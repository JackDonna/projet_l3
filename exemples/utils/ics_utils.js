function parseICSURL (URLdata, ical)
{
    /**
     * @function ical.parseICS
     */
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let obj = [];
    let data = ical.parseICS(URLdata);
    for(let k in data)
    {
        if (data.hasOwnProperty(k)) {
            let ev = data[k];
            if (ev.type === 'VEVENT') {
                let event = {
                    "sumary": ev.summary,
                    "location": ev.location,
                    "date": ev.start.getDate() + "/" + months[ev.start.getMonth()] + "/" + ev.start.getFullYear(),
                    "houres": ev.start.toLocaleTimeString()
                }
                obj.push(event);
                console.log(obj)
            }
        }
    }
    return obj;
}

module.exports = { parseICSURL };