export function transformDate(nS){
    if(nS == undefined || nS == '')return ''; //防止第一次render时出现NAN的判断
    let stringTime = nS;
    let timestamp2 = new Date(stringTime);
    let   year=timestamp2.getFullYear();     
    let   month=timestamp2.getMonth()+1;     
    let   date=timestamp2.getDate();     
    let   hour=timestamp2.getHours();     
    let   minute=timestamp2.getMinutes();     
    let   second=timestamp2.getSeconds();
    if(month<10){
        month = '0'+month
    }
    if(date<10){
        date = '0'+date
    }
    if(hour<10){
        hour = '0'+hour
    }
    if(minute<10){
        minute = '0'+minute
    }
    if(second<10){
        second = '0'+second
    }   
    let time=year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;
    return   time; 
  }