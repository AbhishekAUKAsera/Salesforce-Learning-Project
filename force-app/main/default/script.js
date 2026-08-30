function beforesubmit(){
    let outputdate = document.querySelector('.outputdate');
    let inputdate = document.querySelector('.inputdate');
    console.log('inputdate.value ' + inputdate.value);
    console.log('outputdate.value ' + outputdate.value);

    //new Date(inputdate.value).toLocaleDateString('en-IN');
    let formattedDate = new Date(inputdate.value).toLocaleDateString('en-US');
    outputdate.value = formattedDate;

}