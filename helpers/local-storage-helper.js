const { AESEncrypt, AESDecrypt } = require('./crypto-helper');
const { differenceInDays } = require('date-fns');
module.exports = {
LocalStoreList: function(localSessionName, value, maxDaysOld) {    
    var localStorageData = localStorage.getItem(localSessionName);        
    var today = new Date();
    
    const cDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    
    if(localStorageData == null) {        
        var data = [{value: value, date: cDate}]
        var dataArr = [];
        dataArr.push(data);
        localStorageData = localStorage.setItem(localSessionName,  AESEncrypt(data));             
    }
    else {           
        
        var newDataArr = [];
        let dataArr = AESDecrypt(localStorage.getItem(localSessionName));      
        var isDuplicate= false;
        dataArr.forEach(element => {            
            let recordDate = new Date(element.date);           
            var daysDiff = differenceInDays(today, recordDate,  { addSuffix: false })
    
                if(daysDiff <= maxDaysOld) {
                    newDataArr.push(element);    
                    
                    // Check for duplicate entry
                    //if(element.value.toLowerCase() === value.toLowerCase()) { //removed because it was messing with object
                    if(element.value === value) {
                        isDuplicate = true;            
                    }                                    
                }                
        });      

        // Add new value if value is not a duplicate
        if(!isDuplicate) {
           newDataArr.push({value: value, date: cDate});        
        }
        
        localStorage.setItem(localSessionName, AESEncrypt(newDataArr));                                                                  
        return newDataArr;  
    }
},

DeleteLocalStoreListItem: function(localSessionName, deleteValue) {    
    var localStorageData = localStorage.getItem(localSessionName);        
    
    if(localStorageData !== null) {        
        
        var newDataArr = [];
        let dataArr = AESDecrypt(localStorage.getItem(localSessionName));      
        
        dataArr.forEach(element => {                                                    
            if(element.value !== deleteValue) {
                newDataArr.push(element);    
            }                        
        });        
                
        localStorage.setItem(localSessionName, AESEncrypt(newDataArr));                                                      
            
        return newDataArr;  
    }
},

ClearStorage: function(localSessionName) {
    localStorage.removeItem(localSessionName);
},

GetLocalStorageData: function(localSessionName) {    
    var data = localStorage.getItem(localSessionName);        
    let array = [];
    
    if(data == null) {
        return array;
    }
    else {   
        const lastSearch = AESDecrypt(data);                 
        return lastSearch;  
    }
}
}