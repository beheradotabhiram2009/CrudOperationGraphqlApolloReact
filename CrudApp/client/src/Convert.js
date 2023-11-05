//to set the date
export const toDateStr = (dt) =>{
    const m = dt.getMonth()+1;
    return (dt.getFullYear() + '-' + m + '-' + dt.getDate());
};

export const readFile = async(fr, progress, callback) => {
    return new Promise((resolve, reject) => {
        fr.onload = () => {
            callback(100);
            resolve(fr.result);
        };
        fr.onerror = (err) => {
            callback(0);
            reject(err);
        };
        fr.onprogress = (event) => {
            if (!event.lengthComputable) return;
            setTimeout(()=>{
                var pr = Math.round(100*(event.loaded / event.total));
                if (pr > progress && pr <= 100) callback(pr); 
                else if (pr <= progress) callback(progress);
                else callback(100);
            },1);
        };
    })
};
