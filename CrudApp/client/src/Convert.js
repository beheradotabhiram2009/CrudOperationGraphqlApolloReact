//file to base64
export const fileToBase64 =(file, callback) =>{
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.onerror = (error) => {
        alert('Load Error: '+ error);
    };
    reader.readAsDataURL(file);
};

//to set the date
export const toDateStr=(dt)=>{
    const m = dt.getMonth()+1;
    return (dt.getFullYear() + '-' + m + '-' + dt.getDate());
};